import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * @author MyeongSeok
 * @description refresh token을 검증하고 user 객체(id, name)를 req객체에 주입하는 guard입니다.
 */
@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') {}
