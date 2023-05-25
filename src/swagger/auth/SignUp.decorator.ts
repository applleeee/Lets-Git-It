import {
  AuthSignUpConflictDto,
  AuthSignUpCreatedDto,
} from '../../user/application/dtos/auth-res.dto';
import { applyDecorators } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';

export function SwaggerSignUp(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: '회원가입',
      description:
        'userName, githubId, fieldId, careerId, isKorean 등 유저의 정보를 받아 회원가입 처리 이후 accessToken을 리턴합니다. 그리고 응답 쿠키에 refreshToken을 반환합니다.',
    }),
    ApiCreatedResponse({
      description:
        '회원가입이 되어 accessToken을 리턴합니다. 그리고 응답 쿠키에 refreshToken을 반환합니다.',
      type: AuthSignUpCreatedDto,
    }),
    ApiConflictResponse({
      description: '이미 가입한 회원이 회원 가입을 시도할 때의 응답입니다.',
      type: AuthSignUpConflictDto,
    }),
  );
}
