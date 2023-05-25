import { SwaggerSignUp } from '../../../../swagger/auth/SignUp.decorator';
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
import { Response } from 'express';
import { SignUpRequestDto } from './sign-up.request.dto';

@Controller('user')
@ApiTags('User')
export class SignUpController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  /**
   * @author MyeongSeok
   * @description 회원가입
   * @param userData 회원가입에 필요한 데이터를 body에 받습니다.
   */
  @SwaggerSignUp()
  @Post('/sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(
    @Body() userData: SignUpRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, userId } = await this.authService.signUp(userData);
    const { refreshToken, ...cookieOptions } =
      await this.authService.getCookiesWithJwtRefreshToken(userId);

    await this.userService.saveRefreshToken(refreshToken, userId);

    res.cookie('Refresh', refreshToken, cookieOptions).json({ accessToken });
  }
}
