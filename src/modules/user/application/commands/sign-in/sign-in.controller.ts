import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SignInRequestDto } from './sign-in.request.dto';
import { CommandBus } from '@nestjs/cqrs';
import { SignInCommand } from './sign-in.command';
import { SwaggerSignIn } from 'src/modules/swagger/auth/sing-in.decorator';
import { Response } from 'express';
import {
  SignInOkResDto,
  SignInResCase,
  SignInUnauthorizedResDto,
  SignInWrongCodeDto,
  SignInWrongGithubAccessTokenDto,
} from '../../dtos/sign-in.response.dto';
import { CookieOptions } from 'src/modules/auth/domain/auth.types';

export interface SignInResOk {
  case: SignInResCase;
  refreshToken: string;
  signInOkResDto: SignInOkResDto;
  cookieOptions: CookieOptions;
}

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
  async signIn(
    @Body() dto: SignInRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const command = new SignInCommand(dto);

    const result = await this._commandBus.execute<
      SignInCommand,
      | SignInResOk
      | SignInUnauthorizedResDto
      | SignInWrongCodeDto
      | SignInWrongGithubAccessTokenDto
    >(command);

    switch (result.case) {
      case SignInResCase.UNAUTHORIZED:
        res.status(HttpStatus.UNAUTHORIZED).json(result);
        break;

      case SignInResCase.OK:
        const { refreshToken, signInOkResDto, cookieOptions } =
          result as SignInResOk;
        res.cookie('Refresh', refreshToken, cookieOptions).json(signInOkResDto);
    }
  }
}
