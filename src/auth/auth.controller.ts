import {
  AuthSignInOkResDto,
  AuthSignInUnauthorizedResDto,
  AuthCategoryOkDto,
} from './dto/auth-res.dto';
import { JwtRefreshGuard } from './guard/jwt-refresh.guard';
import { UserService } from './../user/user.service';
import { Response } from 'express';
import { AuthService } from './auth.service';
import {
  Controller,
  Post,
  Body,
  Get,
  HttpStatus,
  HttpCode,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { GithubCodeDto, SignUpWithUserNameDto } from './dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerGetCode } from '../swagger/auth/GetCode.decorator';
import { SwaggerSignIn } from '../swagger/auth/SingIn.decorator';
import { SwaggerSignUp } from '../swagger/auth/SignUp.decorator';
import { SwaggerSignOut } from '../swagger/auth/SingOut.decorator';
import { SwaggerRefresh } from '../swagger/auth/Refresh.decorator';
import { SwaggerGetAuthCategory } from '../swagger/auth/GetAuthCategory.decorator';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  /**
   * @author MyeongSeok
   * @description [개발자용 api] swagger에서 login을 편리하게 하기 위해 만든 api입니다. 로그인 api 요청 바디에 넣을 github code를 받을 수 있는 url을 생성해줍니다.
   */
  @SwaggerGetCode()
  @Get('/getCode')
  @HttpCode(HttpStatus.OK)
  async getCode() {
    return `https://github.com/login/oauth/authorize?client_id=${
      process.env.AUTH_CLIENT_ID_DEV || process.env.AUTH_CLIENT_ID_LOCAL
    }&redirect_uri=${
      process.env.AUTH_CALLBACK_DEV || process.env.AUTH_CALLBACK_LOCAL
    }/githublogin`;
  }

  /**
   * @author MyeongSeok
   * @description 로그인
   * @param githubCode githubCode
   */
  @SwaggerSignIn()
  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() githubCode: GithubCodeDto,
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

  /**
   * @author MyeongSeok
   * @description 회원가입
   * @param userData 회원가입에 필요한 데이터를 body에 받습니다.
   */
  @SwaggerSignUp()
  @Post('/sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(
    @Body() userData: SignUpWithUserNameDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, userId } = await this.authService.signUp(userData);
    const { refreshToken, ...cookieOptions } =
      await this.authService.getCookiesWithJwtRefreshToken(userId);

    await this.userService.saveRefreshToken(refreshToken, userId);

    res.cookie('Refresh', refreshToken, cookieOptions).json({ accessToken });
  }

  /**
   * @author MyeongSeok
   * @description 로그아웃
   */
  @SwaggerSignOut()
  @UseGuards(JwtRefreshGuard)
  @Get('/sign-out')
  @HttpCode(HttpStatus.OK)
  async signOut(@Req() req, @Res({ passthrough: true }) res: Response) {
    await this.userService.deleteRefreshToken(req.user.id);
    res.cookie('Refresh', null, { expires: new Date(0) });
    return { message: 'LOG_OUT_COMPLETED' };
  }

  /**
   * @author MyeongSeok
   * @description 리프레시 토큰으로 엑세스 토큰을 재발급 받습니다.
   */
  @SwaggerRefresh()
  @UseGuards(JwtRefreshGuard)
  @Get('/refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    const currentRefreshToken = req.signedCookies.Refresh;
    const { user } = req;
    const accessToken = await this.authService.getJwtAccessToken(
      user.id,
      user.userName,
    );
    const refreshTokenRegenerationRequired: boolean =
      await this.authService.isRefreshTokenExpirationDateHalfPast(
        currentRefreshToken,
      );
    if (refreshTokenRegenerationRequired) {
      const { refreshToken, ...cookieOptions } =
        await this.authService.getCookiesWithJwtRefreshToken(user.id);

      await this.userService.saveRefreshToken(refreshToken, user.id);

      res.cookie('Refresh', refreshToken, cookieOptions).json({ accessToken });
    } else {
      res.json({ accessToken });
    }
  }

  /**
   * @author MyeongSeok
   * @description 회원가입 시 유저의 개인정보 선택지를 제공합니다.
   */
  @SwaggerGetAuthCategory()
  @Get('/category')
  @HttpCode(HttpStatus.OK)
  getAuthCategory(): Promise<AuthCategoryOkDto> {
    return this.authService.getAuthCategory();
  }
}
