import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import authConfig from '../../../config/authConfig';
import cookieConfig from '../../../config/cookieConfig';
import { pbkdf2 } from 'crypto';
import { promisify } from 'util';
import { RefreshTokenRepositoryPort } from '../database/refresh-token.repository.port';
import { REFRESH_TOKEN_REPOSITORY } from '../auth.di-tokens';
import {
  AccessTokenPayload,
  CookieOptions,
  JwtAccessToken,
  JwtRefreshToken,
  RefreshTokenPayload,
} from '../domain/auth.types';
import { RefreshTokenEntity } from '../domain/refresh-token.entity';
import { DataSource } from 'typeorm';
import { RefreshTokenMapper } from '../mapper/refresh-token.mapper';
import { RefreshToken } from '../database/refresh-token.orm-entity';
import { User } from 'src/modules/user/database/entity/user.orm-entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly _jwtService: JwtService,
    @Inject(cookieConfig.KEY)
    private readonly _cookieConfig: ConfigType<typeof cookieConfig>,
    @Inject(authConfig.KEY)
    private readonly _authConfig: ConfigType<typeof authConfig>,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly _refreshTokenRepository: RefreshTokenRepositoryPort,
    private readonly _dataSource: DataSource,
    private readonly _refreshTokenMapper: RefreshTokenMapper,
  ) {}

  getJwtAccessToken(payload: AccessTokenPayload): JwtAccessToken {
    const accessToken = this._jwtService.sign(payload, {
      secret: this._authConfig.jwtSecret,
      expiresIn: `${this._authConfig.jwtExpiresIn}s`,
    });
    return { accessToken };
  }

  getCookiesWithJwtRefreshToken(
    payload: RefreshTokenPayload,
  ): JwtRefreshToken & CookieOptions {
    const { refreshToken } = this.getJwtRefreshToken(payload);
    const cookieOptions: CookieOptions = this.getCookieOptions();
    return { refreshToken, ...cookieOptions };
  }

  getJwtRefreshToken(payload: RefreshTokenPayload): JwtRefreshToken {
    const refreshToken = this._jwtService.sign(payload, {
      secret: this._authConfig.jwtRefreshSecret,
      expiresIn: `${this._authConfig.jwtRefreshExpiresIn}s`,
    });
    return { refreshToken };
  }

  getCookiesForLogOut() {
    const cookieOptions = this.getCookieOptions();
    delete cookieOptions.maxAge;
    return cookieOptions;
  }

  private getCookieOptions(): CookieOptions {
    return {
      domain: this._cookieConfig.domain,
      path: '/',
      httpOnly: true,
      maxAge: Number(this._authConfig.jwtRefreshExpiresIn) * 1000,
      sameSite: 'none' as const,
      secure: true,
      signed: true,
    } as CookieOptions;
  }

  async isRefreshTokenExpirationDateHalfPast(
    refreshToken: string,
  ): Promise<any> {
    const { userId, iat, exp } = await this._jwtService.verify(refreshToken, {
      secret: this._authConfig.jwtRefreshSecret,
    });

    return {
      userId,
      isRefreshTokenExpirationDateHalfPast:
        (exp * 1000 - Date.now()) / (exp * 1000 - iat * 1000) < 0.5,
    };
  }

  async updateRefreshToken({ userId, refreshToken }) {
    const hashedRefreshToken = await this.hashRefreshToken(refreshToken);
    const refreshTokenEntity = RefreshTokenEntity.create({
      userId,
      hashedRefreshToken,
    });

    const refreshTokenOrmEntity =
      this._refreshTokenMapper.toPersistence(refreshTokenEntity);

    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { id: refreshTokenIdInDb } = await queryRunner.manager.findOne<{
        id: string;
        userId: string;
      } | null>(RefreshToken, {
        where: { userId },
        select: { id: true, userId: true },
      });

      const updatedResult = await queryRunner.manager.softDelete(RefreshToken, {
        id: refreshTokenIdInDb,
      });

      if (updatedResult.affected === 0) {
        throw new Error('NO_EXIST_USER_ID');
      }

      await queryRunner.manager.insert(RefreshToken, refreshTokenOrmEntity);
      await queryRunner.manager.update(User, userId, {
        refreshTokenId: refreshTokenOrmEntity.id,
      });

      await queryRunner.commitTransaction();

      return refreshTokenEntity;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      console.log('transaction error: ', error);

      throw new BadRequestException('REFRESH_TOKEN_RE_GENERATION_FAILED');
    } finally {
      await queryRunner.release();
    }
  }

  async hashRefreshToken(refreshToken: string) {
    const salt = process.env.REFRESH_SALT;
    const iterations = +process.env.REFRESH_ITERATIONS;
    const keylen = +process.env.REFRESH_KEYLEN;
    const digest = process.env.REFRESH_DIGEST;
    const pbkdf2Promise = promisify(pbkdf2);
    const key = await pbkdf2Promise(
      refreshToken,
      salt,
      iterations,
      keylen,
      digest,
    );

    const hashedRefreshToken = key.toString('base64');

    return hashedRefreshToken;
  }

  async isRefreshTokenMatches(refreshToken: string, userId: string) {
    const refreshTokenEntity: RefreshTokenEntity =
      await this._refreshTokenRepository.findOneByUserId(userId);

    const { hashedRefreshToken } = refreshTokenEntity.getProps();

    return await this.verifyRefreshToken(hashedRefreshToken, refreshToken);
  }

  private async verifyRefreshToken(
    hashedRefreshToken: string,
    currentRefreshToken: string,
  ) {
    const currentHashedRefreshToken = await this.hashRefreshToken(
      currentRefreshToken,
    );

    if (currentHashedRefreshToken !== hashedRefreshToken)
      throw new UnauthorizedException('UNAUTHORIZED');

    return true;
  }
}
