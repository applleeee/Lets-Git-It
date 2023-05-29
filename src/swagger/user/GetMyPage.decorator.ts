import {
  GetUserResponseDto,
  GetMyPageUnauthorizedDto,
} from './../../user/application/dtos/get-user.response.dto';
import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function SwaggerGetMyPage(): MethodDecorator {
  return applyDecorators(
    ApiBearerAuth('accessToken'),

    ApiOperation({
      summary: '유저 정보 조회',
      description: 'MyPage에 필요한 정보를 반환합니다.',
    }),
    ApiOkResponse({
      description:
        'AccessToken으로 유저의 권한 검증에 통과되면 해당 유저의 정보를 반환합니다.',
      type: GetUserResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'AccessToken이 누락되었거나 기간이 만료된 경우입니다.',
      type: GetMyPageUnauthorizedDto,
    }),
  );
}
