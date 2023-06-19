import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import authConfig from '../../../config/authConfig';
import { RefreshTokenPayload } from '../domain/auth.types';
import { Request } from 'express';
import { AuthService } from '../application/auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    @Inject(authConfig.KEY)
    private readonly _config: ConfigType<typeof authConfig>,
    private readonly _authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.signedCookies?.Refresh;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: _config.jwtRefreshSecret,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: RefreshTokenPayload) {
    const refreshToken = request.signedCookies?.Refresh;
    const { userId } = payload;

    const isRefreshTokenMatches = await this._authService.isRefreshTokenMatches(
      refreshToken,
      userId,
    );

    if (isRefreshTokenMatches) {
      const user = { id: userId };

      return user;
    }
  }
}
