import {
  AuthSignInOkResDto,
  AuthSignInWrongCodeDto,
  AuthSignUpCreatedDto,
  AuthSignInUnauthorizedResDto,
  AuthCategoryOkDto,
  SignOutOkDto,
  RefreshOkDto,
} from './dto/auth-res.dto';
import { JwtRefreshGuard } from './guard/jwt-refresh.guard';
import { UserService } from './../user/user.service';
import { Request, Response } from 'express';
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
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

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
  @Get('/getCode')
  @ApiOperation({
    summary: '[개발자용] github Authorization Code 받는 url을 만들어주는 api',
    description:
      'swagger api-docs에서  login을 편리하게 하기 위해 만든 api입니다. 로그인 api 요청 바디에 넣을 github code를 받을 수 있는 url을 생성해줍니다.',
  })
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
  @Post('/sign-in')
  @ApiOperation({
    summary: '로그인',
    description:
      'github code를 Body로 받아 accessToken을 리턴합니다. 그리고 응답 쿠키에 refreshToken을 반환합니다. 쿠키는 브라우저 쿠키로 저장됩니다.',
  })
  @ApiOkResponse({
    description:
      '로그인에 성공하여 accessToken을 Res body로 리턴합니다. 그리고 응답 쿠키에 refreshToken을 반환합니다.',
    type: AuthSignInOkResDto,
  })
  @ApiUnauthorizedResponse({
    description: '가입되지 않은 유저입니다.',
    type: AuthSignInUnauthorizedResDto,
  })
  @ApiBadRequestResponse({
    description: 'GitHub code에 문제가 있습니다.',
    type: AuthSignInWrongCodeDto,
  })
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
  @Post('/sign-up')
  @ApiOperation({
    summary: '회원가입',
    description:
      'userName, githubId, fieldId, careerId, isKorean 등 유저의 정보를 받아 회원가입 처리 이후 accessToken을 리턴합니다. 그리고 응답 쿠키에 refreshToken을 반환합니다.',
  })
  @ApiCreatedResponse({
    description:
      '회원가입이 되어 accessToken을 리턴합니다. 그리고 응답 쿠키에 refreshToken을 반환합니다.',
    type: AuthSignUpCreatedDto,
  })
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
  @UseGuards(JwtRefreshGuard)
  @Get('/sign-out')
  @ApiCookieAuth()
  @ApiOperation({
    summary: '로그아웃',
    description: '로그아웃 시 응답 쿠키에 빈 값을 넣어 반환합니다.',
  })
  @ApiOkResponse({
    description:
      '로그아웃 시 LOG_OUT_COMPLETED 메시지와 함께 응답 쿠키에 빈 값을 넣어 반환합니다.',
    type: SignOutOkDto,
  })
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
  @UseGuards(JwtRefreshGuard)
  @Get('/refresh')
  @ApiCookieAuth()
  @ApiOperation({
    summary: '엑세스 토큰 재발급',
    description: '리프레시 토큰으로 엑세스 토큰을 재발급 받습니다.',
  })
  @ApiOkResponse({
    description:
      '리프레시 토큰으로 엑세스 토큰을 재발급 받습니다. 만약 리프레시 토큰의 만료기한이 절반보다 적게 남았을 경우 리프레시 토큰도 재발행하여 쿠키에 담아 반환합니다.',
    type: RefreshOkDto,
  })
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    const currentRefreshToken = req.signedCookies.Refresh;
    console.log('currentRefreshToken: ', currentRefreshToken);
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
  @Get('/category')
  @ApiOperation({
    summary: '유저 정보 카테고리',
    description: '회원가입 시 유저의 개인정보 선택지를 제공합니다.',
  })
  @ApiOkResponse({
    description: '개발 분야, 개발 경력에 대한 카테고리를 리턴합니다.',
    type: AuthCategoryOkDto,
  })
  @HttpCode(HttpStatus.OK)
  getAuthCategory(): Promise<AuthCategoryOkDto> {
    return this.authService.getAuthCategory();
  }
}
