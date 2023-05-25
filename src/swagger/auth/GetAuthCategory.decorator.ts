import { AuthCategoryOkDto } from '../../user/application/dtos/auth-res.dto';
import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

export function SwaggerGetAuthCategory(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: '유저 정보 카테고리',
      description: '회원가입 시 유저의 개인정보 선택지를 제공합니다.',
    }),
    ApiOkResponse({
      description: '개발 분야, 개발 경력에 대한 카테고리를 리턴합니다.',
      type: AuthCategoryOkDto,
    }),
  );
}
