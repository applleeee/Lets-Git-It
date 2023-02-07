import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    const user = { id: payload.userId };
    // todo 상태유지가 필요한 정보 추가 필요, but, 로직이 구현이 안되어있으므로 로직 만든 후 추가예정
    // 상태유지 필요 정보 : commentLike, postLike, comment, post
    //
    return user;
  }
}
