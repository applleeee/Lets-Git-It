import {
  JwtAccessToken,
  JwtRefreshToken,
} from 'src/modules/auth/domain/auth.types';
import {
  AccessTokenPayload,
  CookieOptions,
  RefreshTokenPayload,
} from 'src/modules/auth/domain/auth.types';

export interface AuthServicePort {
  getJwtAccessToken(payload: AccessTokenPayload): JwtAccessToken;
  getCookiesWithJwtRefreshToken(
    payload: RefreshTokenPayload,
  ): JwtRefreshToken & { cookieOptions: CookieOptions };
  updateRefreshToken(refreshToken: string, userId: string): Promise<void>;
  // insertRefreshToken(
  //   insertRefreshTokenProps: InsertRefreshTokenProps,
  // ): Promise<boolean>;
  isRefreshTokenExpirationDateHalfPast(refreshToken: string): Promise<boolean>;
  hashRefreshToken(refreshToken: string): Promise<string>;
}
