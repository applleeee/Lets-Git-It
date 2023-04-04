import { jwtConstants } from './../constants';
import { UserService } from './../../user/user.service';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.signedCookies?.Refresh;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.jwtRefreshSecret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.signedCookies?.Refresh;

    if (!refreshToken)
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);

    const { userId } = payload;

    const user = await this.userService.getUserIfRefreshTokenMatches(
      refreshToken,
      userId,
    );

    return user;
  }
}
