import {
  AuthSignOutUnauthorizedDto,
  SignOutOkDto,
} from '../../user/application/dtos/auth-res.dto';
import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function SwaggerSignOut(): MethodDecorator {
  return applyDecorators(
    ApiCookieAuth(),
    ApiOperation({
      summary: '로그아웃',
      description: '로그아웃 시 응답 쿠키에 빈 값을 넣어 반환합니다.',
    }),
    ApiOkResponse({
      description:
        '로그아웃 시 LOG_OUT_COMPLETED 메시지와 함께 응답 쿠키에 빈 값을 넣어 반환합니다.',
      type: SignOutOkDto,
    }),
    ApiUnauthorizedResponse({
      description: 'refresh token이 없거나 기간이 만료된 경우입니다.',
      type: AuthSignOutUnauthorizedDto,
    }),
  );
}
