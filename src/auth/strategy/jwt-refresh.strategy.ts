import { jwtConstants } from './../constants';
import { UserService } from './../../user/user.service';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

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
      secretOrKey: jwtConstants.jwtRefreshSecret,
      passReqToCallBack: true,
    });
  }

  async validate(req, payload: any) {
    const refreshToken = req.signedCookies?.Refresh;

    if (!refreshToken)
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);

    const { userId } = payload;
    return this.userService.getUserIfRefreshTokenMatches(refreshToken, userId);
  }
}
