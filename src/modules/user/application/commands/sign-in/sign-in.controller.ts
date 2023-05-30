import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SignInRequestDto } from './sign-in.request.dto';
import { CommandBus } from '@nestjs/cqrs';
import { SignInCommand } from './sign-in.command';
import { SwaggerSignIn } from 'src/modules/swagger/auth/sing-in.decorator';

@Controller('user')
@ApiTags('User')
export class SignInController {
  constructor(private readonly _commandBus: CommandBus) {}

  /**
   * @author MyeongSeok
   * @description 로그인
   * @body githubCode githubCode
   */
  @SwaggerSignIn()
  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() dto: SignInRequestDto) {
    const command = new SignInCommand(dto);

    return await this._commandBus.execute(command);
  }
}
