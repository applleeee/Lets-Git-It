import {
  JwtAccessToken,
  JwtRefreshToken,
  UpdateRefreshTokenProps,
} from 'src/modules/auth/domain/auth.types';
import {
  AccessTokenPayload,
  CookieOptions,
  RefreshTokenPayload,
} from 'src/modules/auth/domain/auth.types';
import { RefreshTokenEntity } from 'src/modules/auth/domain/refresh-token.entity';

export interface AuthServicePort {
  getJwtAccessToken(payload: AccessTokenPayload): JwtAccessToken;
  getCookiesWithJwtRefreshToken(
    payload: RefreshTokenPayload,
  ): JwtRefreshToken & { cookieOptions: CookieOptions };
  updateRefreshToken(
    updateRefreshTokenProps: UpdateRefreshTokenProps,
  ): Promise<RefreshTokenEntity>;
  isRefreshTokenExpirationDateHalfPast(refreshToken: string): Promise<boolean>;
  hashRefreshToken(refreshToken: string): Promise<string>;
}
