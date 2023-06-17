import { CommandBus } from '@nestjs/cqrs';
import { SwaggerSignUp } from '../../../../swagger/auth/sign-up.decorator';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SignUpRequestDto } from './sign-up.request.dto';
import { SignUpCommand } from './sign-up.command';
import { Response } from 'express';

@Controller('user')
@ApiTags('User')
export class SignUpController {
  constructor(private readonly _commandBus: CommandBus) {}

  /**
   * @author MyeongSeok
   * @description 회원가입
   * @param userData 회원가입에 필요한 데이터를 body에 받습니다.
   */
  @SwaggerSignUp()
  @Post('/sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() userData: SignUpRequestDto, @Res() response: Response) {
    const command = new SignUpCommand(userData);
    const { accessToken, refreshToken, cookieOptions } =
      await this._commandBus.execute(command);

    response
      .cookie('Refresh', refreshToken, cookieOptions)
      .json({ accessToken });
    // const { accessToken, userId } = await this.authService.signUp(userData);
    //   const { refreshToken, ...cookieOptions } =
    //     await this.authService.getCookiesWithJwtRefreshToken(userId);
    //   await this.userService.saveRefreshToken(refreshToken, userId);
    //   res.cookie('Refresh', refreshToken, cookieOptions).json({ accessToken });
  }
}
