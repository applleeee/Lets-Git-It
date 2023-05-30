import {
  RefreshOkDto,
  RefreshUnauthorizedDto,
} from '../../module/auth/dtos/refresh.response.dto';
import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function SwaggerRefresh(): MethodDecorator {
  return applyDecorators(
    ApiCookieAuth(),
    ApiOperation({
      summary: '엑세스 토큰 재발급',
      description: '리프레시 토큰으로 엑세스 토큰을 재발급 받습니다.',
    }),
    ApiOkResponse({
      description:
        '리프레시 토큰으로 엑세스 토큰을 재발급 받습니다. 만약 리프레시 토큰의 만료기한이 절반보다 적게 남았을 경우 리프레시 토큰도 재발행하여 쿠키에 담아 반환합니다.',
      type: RefreshOkDto,
    }),
    ApiUnauthorizedResponse({
      description:
        '만료된 refresh token 또는 refresh token이 없이 요청한 경우입니다.',
      type: RefreshUnauthorizedDto,
    }),
  );
}
