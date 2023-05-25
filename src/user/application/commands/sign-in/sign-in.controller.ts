import {
  AuthSignInOkResDto,
  AuthSignInUnauthorizedResDto,
} from '../../dtos/auth-res.dto';
import { UserService } from './../../user.service';
import { AuthService } from './../../../../auth/auth.service';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerSignIn } from 'src/swagger/auth/SingIn.decorator';
import { Response } from 'express';
import { SignInRequestDto } from './sign-in.request.dto';

@Controller('user')
@ApiTags('User')
export class SignInController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  /**
   * @author MyeongSeok
   * @description 로그인
   * @param githubCode githubCode
   */
  @SwaggerSignIn()
  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() githubCode: SignInRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userInfo = await this.authService.signIn(githubCode);

    if (!userInfo.isMember) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json(userInfo as AuthSignInUnauthorizedResDto);
    } else {
      const { userId, ...accessTokenWithUserInfo } = userInfo;

      const { refreshToken, ...cookieOptions } =
        await this.authService.getCookiesWithJwtRefreshToken(userId);

      await this.userService.saveRefreshToken(refreshToken, userId);

      res
        .cookie('Refresh', refreshToken, cookieOptions)
        .json(accessTokenWithUserInfo as AuthSignInOkResDto);
    }
  }
}
