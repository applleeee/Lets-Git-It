import { AuthService } from 'src/modules/auth/application/auth.service';
import { Injectable } from '@nestjs/common';
import { AuthServicePort } from './auth.service.port';
import {
  AccessTokenPayload,
  CookieOptions,
  JwtAccessToken,
  JwtRefreshToken,
  RefreshTokenPayload,
} from 'src/modules/auth/domain/auth.types';

@Injectable()
export class AuthServiceAdaptor implements AuthServicePort {
  constructor(private readonly _authService: AuthService) {}

  getJwtAccessToken(payload: AccessTokenPayload): JwtAccessToken {
    return this._authService.getJwtAccessToken(payload);
  }

  getCookiesWithJwtRefreshToken(
    payload: RefreshTokenPayload,
  ): JwtRefreshToken & { cookieOptions: CookieOptions } {
    const { refreshToken, ...cookieOptions } =
      this._authService.getCookiesWithJwtRefreshToken(payload);

    return { refreshToken, cookieOptions };
  }

  // async insertRefreshToken(
  //   insertRefreshTokenProps: InsertRefreshTokenProps,
  // ): Promise<boolean> {
  //   return await this._authService.insertRefreshToken(insertRefreshTokenProps);
  // }

  async updateRefreshToken(refreshToken: string, userId: string) {
    await this._authService.updateRefreshToken(refreshToken, userId);
  }

  async isRefreshTokenExpirationDateHalfPast(
    refreshToken: string,
  ): Promise<boolean> {
    return await this._authService.isRefreshTokenExpirationDateHalfPast(
      refreshToken,
    );
  }

  async hashRefreshToken(refreshToken: string) {
    return await this._authService.hashRefreshToken(refreshToken);
  }
}
