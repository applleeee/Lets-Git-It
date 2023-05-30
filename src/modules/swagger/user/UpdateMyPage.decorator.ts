import {
  UpdateMyPageCreatedDto,
  UpdateMyPageUnauthorizedDto,
} from '../../user/application/dtos/update-user.response.dto';
import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function SwaggerUpdateMyPage(): MethodDecorator {
  return applyDecorators(
    ApiBearerAuth('accessToken'),

    ApiOperation({
      summary: '유저 정보 수정',
      description:
        'MyPage에서 유저 개인 정보 수정에 활용됩니다. request body에 fieldId, careerId, isKorean 값을 담습니다.',
    }),
    ApiCreatedResponse({
      description: '요청 성공 시 USER_INFO_UPDATED 메시지를 반환받습니다.',
      type: UpdateMyPageCreatedDto,
    }),
    ApiUnauthorizedResponse({
      description: 'AccessToken이 누락되었거나 기간이 만료된 경우입니다.',
      type: UpdateMyPageUnauthorizedDto,
    }),
  );
}
