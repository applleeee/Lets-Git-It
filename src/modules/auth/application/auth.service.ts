import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import authConfig from '../../../config/authConfig';
import cookieConfig from '../../../config/cookieConfig';
import { pbkdf2 } from 'crypto';
import { promisify } from 'util';
import { RefreshTokenRepositoryPort } from '../database/refresh-token.repository.port';
import { REFRESH_TOKEN_REPOSITORY } from '../auth.di-tokens';
import { RankerProfileRepository } from '../../rank/rankerProfile.repository';
import {
  AccessTokenPayload,
  CookieOptions,
  JwtAccessToken,
  JwtRefreshToken,
  RefreshTokenPayload,
} from '../domain/auth.types';
import { RefreshTokenEntity } from '../domain/refresh-token.entity';

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
    private readonly _rankerProfileRepository: RankerProfileRepository,
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

  // async insertRefreshToken(
  //   insertRefreshTokenProps: InsertRefreshTokenProps,
  // ): Promise<boolean> {
  //   const { refreshToken, userId } = insertRefreshTokenProps;
  //   const hashedRefreshToken = await this.hashRefreshToken(refreshToken);
  //   const refreshTokenEntity = RefreshTokenEntity.create({
  //     hashedRefreshToken,
  //     userId,
  //   });
  //   return await this._refreshTokenRepository.insert(refreshTokenEntity);
  // }

  async updateRefreshToken(refreshToken: string, userId: string) {
    const hashedRefreshToken = await this.hashRefreshToken(refreshToken);
    const refreshTokenEntity = RefreshTokenEntity.create({
      userId,
      hashedRefreshToken,
    });
    // todo user 테이블에 refreshTokenRepository id 넣어주기
    await this._refreshTokenRepository.deleteRefreshTokenByUserId(userId);
    await this._refreshTokenRepository.insert(refreshTokenEntity);
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

  async deleteRefreshToken(id: string) {
    const refreshTokenEntity = RefreshTokenEntity.create({
      userId: id,
      hashedRefreshToken: null,
    });
    return await this._refreshTokenRepository.softRemove(refreshTokenEntity);
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, id: string) {
    const user = await this._refreshTokenRepository.findOneById(id);
    const { hashedRefreshToken } = user.getProps();
    const isRefreshTokenMatching: boolean = await this.verifyRefreshToken(
      hashedRefreshToken,
      refreshToken,
    );

    if (isRefreshTokenMatching) {
      const userName = await this._rankerProfileRepository.getUserNameByUserId(
        id,
      );

      return { id, userName };
    }
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
