import { ApiOperation } from '@nestjs/swagger';

export function SwaggerGetCode(): MethodDecorator {
  return ApiOperation({
    summary: '[개발자용] github Authorization Code 받는 url을 만들어주는 api',
    description:
      'swagger api-docs에서  login을 편리하게 하기 위해 만든 api입니다. 로그인 api 요청 바디에 넣을 github code를 받을 수 있는 url을 생성해줍니다.',
  });
}
