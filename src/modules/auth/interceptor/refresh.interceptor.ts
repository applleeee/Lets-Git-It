import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { AuthService } from '../application/auth.service';
import { RefreshTokenPayload } from '../domain/auth.types';
import { Response } from 'express';
import { IncomingMessage } from 'http';

@Injectable()
export class RefreshInterceptor implements NestInterceptor<any, Response> {
  constructor(private readonly _authService: AuthService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = this.getRequest<
      IncomingMessage & { user: Record<string, unknown> } // IncomingMessage가 뭔지 알게 되면 저거 타입을 refreshRequest로 만들어서 쓰자. 컨트롤러에도 타입 넣기
    >(context);
    const refreshToken = this.getRefreshToken(request);
    const res: Response = this.getResponse(context);

    const { userId, isRefreshTokenExpirationDateHalfPast } =
      await this._authService.isRefreshTokenExpirationDateHalfPast(
        refreshToken,
      );

    if (isRefreshTokenExpirationDateHalfPast) {
      const refreshTokenPayload: RefreshTokenPayload = { userId };
      const { refreshToken, ...cookieOptions } =
        this._authService.getCookiesWithJwtRefreshToken(refreshTokenPayload);
      await this._authService.updateRefreshToken({ refreshToken, userId });

      request.user.refreshToken = refreshToken;

      return next.handle().pipe(
        map((data) => {
          res.cookie('Refresh', refreshToken, cookieOptions);
          return data;
        }),
      );
    } else {
      return next.handle().pipe(map((data) => data));
    }
  }

  private getRequest<T>(context: ExecutionContext): T {
    return context.switchToHttp().getRequest();
  }

  private getResponse(context: ExecutionContext) {
    return context.switchToHttp().getResponse();
  }

  private getRefreshToken(request) {
    const {
      signedCookies: { Refresh: refreshToken },
    } = request;

    return refreshToken;
  }
}
