import {
  AuthSignInOkResDto,
  AuthSignInUnauthorizedResDto,
  AuthSignInWrongCodeDto,
  AuthSignInWrongGithubAccessTokenDto,
} from '../../../modules/auth/dto/auth-res.dto';
import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function SwaggerSignIn(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: '로그인',
      description:
        'github code를 Body로 받아 accessToken을 리턴합니다. 그리고 응답 쿠키에 refreshToken을 반환합니다. 쿠키는 브라우저 쿠키로 저장됩니다.',
    }),
    ApiOkResponse({
      description:
        '로그인에 성공하여 accessToken을 Res body로 리턴합니다. 그리고 응답 쿠키에 refreshToken을 반환합니다.',
      type: AuthSignInOkResDto,
    }),
    ApiUnauthorizedResponse({
      description: '가입되지 않은 유저입니다.',
      type: AuthSignInUnauthorizedResDto,
    }),
    ApiBadRequestResponse({
      description: '잘못된 github code입니다. ',
      type: AuthSignInWrongCodeDto,
    }),
    ApiNotFoundResponse({
      description:
        'github access token으로 github user 정보 조회에 실패한 경우입니다.',
      type: AuthSignInWrongGithubAccessTokenDto,
    }),
  );
}
