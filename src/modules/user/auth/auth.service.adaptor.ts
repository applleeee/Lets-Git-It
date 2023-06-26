import { UpdateRefreshTokenProps } from './../../auth/domain/auth.types';
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

  async updateRefreshToken(updateRefreshTokenProps: UpdateRefreshTokenProps) {
    return await this._authService.updateRefreshToken(updateRefreshTokenProps);
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
