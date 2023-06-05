import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import authConfig from '../../config/authConfig';
import cookieConfig from '../../config/cookieConfig';
import { pbkdf2 } from 'crypto';
import { promisify } from 'util';
import { RefreshTokenRepositoryPort } from './database/refresh-token.repository.port';
import { REFRESH_TOKEN_REPOSITORY } from './auth.di-tokens';
import { RankerProfileRepository } from '../rank/rankerProfile.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(cookieConfig.KEY)
    private readonly _cookieConfig: ConfigType<typeof cookieConfig>,
    @Inject(authConfig.KEY)
    private readonly _authConfig: ConfigType<typeof authConfig>,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly _refreshTokenRepository: RefreshTokenRepositoryPort,
    private readonly _rankerProfileRepository: RankerProfileRepository,
  ) {}

  async getJwtAccessToken(userId: string, userName: string) {
    const payload = { userId, userName };
    return this.jwtService.sign(payload, {
      secret: this._authConfig.jwtSecret,
      expiresIn: `${this._authConfig.jwtExpiresIn}s`,
    });
  }

  async getCookiesWithJwtRefreshToken(userId: string) {
    const payload = { userId };
    const refreshToken = this.jwtService.sign(payload, {
      secret: this._authConfig.jwtRefreshSecret,
      expiresIn: `${this._authConfig.jwtRefreshExpiresIn}s`,
    });
    const cookieOptions = this.getCookieOptions();
    return { refreshToken, ...cookieOptions };
  }

  async isRefreshTokenExpirationDateHalfPast(
    refreshToken: string,
  ): Promise<boolean> {
    const payload = await this.jwtService.verify(refreshToken, {
      secret: this._authConfig.jwtRefreshSecret,
    });

    return (payload.exp - Date.now()) / (payload.exp - payload.iat) < 0.5;
  }

  async getCookiesForLogOut() {
    const cookieOptions = this.getCookieOptions();
    const { maxAge, ...refreshOptions } = cookieOptions;
    return refreshOptions;
  }

  private getCookieOptions() {
    return {
      domain: this._cookieConfig.domain,
      path: '/',
      httpOnly: true,
      maxAge: Number(this._authConfig.jwtRefreshExpiresIn) * 1000,
      sameSite: 'none' as const,
      secure: true,
      signed: true,
    };
  }

  async saveRefreshToken(refreshToken: string, userId: string) {
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

    return await this._refreshTokenRepository.updateUserRefreshToken(
      userId,
      hashedRefreshToken,
    );
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

  // authService
  async verifyRefreshToken(
    hashedRefreshToken: string,
    currentRefreshToken: string,
  ) {
    const salt = process.env.REFRESH_SALT;
    const iterations = +process.env.REFRESH_ITERATIONS;
    const keylen = +process.env.REFRESH_KEYLEN;
    const digest = process.env.REFRESH_DIGEST;
    const pbkdf2Promise = promisify(pbkdf2);
    const key = await pbkdf2Promise(
      currentRefreshToken,
      salt,
      iterations,
      keylen,
      digest,
    );
    const currentHashedRefreshToken = key.toString('base64');

    if (currentHashedRefreshToken !== hashedRefreshToken)
      throw new UnauthorizedException('UNAUTHORIZED');

    return true;
  }

  async deleteRefreshToken(id: string) {
    return await this._refreshTokenRepository.updateUserRefreshToken(id, null);
  }
}
