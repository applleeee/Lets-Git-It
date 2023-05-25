import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerGetCode } from 'src/swagger/auth/GetCode.decorator';

@Controller('auth')
@ApiTags('Auth')
export class GetCodeController {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  /**
   * @author MyeongSeok
   * @description [개발자용 api] swagger에서 login을 편리하게 하기 위해 만든 api입니다. 로그인 api 요청 바디에 넣을 github code를 받을 수 있는 url을 생성해줍니다.
   */
  @SwaggerGetCode()
  @Get('/getCode')
  @HttpCode(HttpStatus.OK)
  async getCode() {
    return `https://github.com/login/oauth/authorize?client_id=${process.env.AUTH_CLIENT_ID}&redirect_uri=${process.env.AUTH_CALLBACK}/githublogin`;
  }
}
