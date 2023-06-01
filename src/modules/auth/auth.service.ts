import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import authConfig from '../../config/authConfig';
import cookieConfig from '../../config/cookieConfig';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(cookieConfig.KEY)
    private readonly _cookieConfig: ConfigType<typeof cookieConfig>,
    @Inject(authConfig.KEY)
    private readonly _authConfig: ConfigType<typeof authConfig>,
  ) {}

  // async signIn(githubCode: SignInRequestDto) {
  //   const { code } = githubCode;

  //   const userName = githubUserInfo.login;
  //   const user = await this.userService.getByGithubId(githubUserInfo.id);

  //   if (!user) {
  //     return {
  //       isMember: false,
  //       userName: userName,
  //       githubId: githubUserInfo.id,
  //     };
  //   }

  //   const jwtToken = await this.getJwtAccessToken(user.id, userName);

  //   return {
  //     isMember: true,
  //     userName: userName,
  //     accessToken: jwtToken,
  //     userId: user.id,
  //   };
  // }

  // async signUp(signUpDataWithUserName) {
  //   const { userName, ...signUpData } = signUpDataWithUserName;
  //   await this.userService.createUser(signUpData);

  //   const user = await this.userService.getUserByGithubId(signUpData.githubId);

  async getJwtAccessToken(userId: string, userName: string) {
    const payload = { userId, userName };
    return this.jwtService.sign(payload, {
      secret: this._authConfig.jwtSecret,
      expiresIn: `${this._authConfig.jwtExpiresIn}s`,
    });
  }

  async getCookiesWithJwtRefreshToken(userId: string) {
    const payload = { userId };
    const refreshToken = this.jwtService.sign(payload, {
      secret: this._authConfig.jwtRefreshSecret,
      expiresIn: `${this._authConfig.jwtRefreshExpiresIn}s`,
    });
    const cookieOptions = this.getCookieOptions();
    return { refreshToken, ...cookieOptions };
  }

  async isRefreshTokenExpirationDateHalfPast(
    refreshToken: string,
  ): Promise<boolean> {
    const payload = await this.jwtService.verify(refreshToken, {
      secret: this._authConfig.jwtRefreshSecret,
    });

    return (payload.exp - Date.now()) / (payload.exp - payload.iat) < 0.5;
  }

  async getCookiesForLogOut() {
    const cookieOptions = this.getCookieOptions();
    const { maxAge, ...refreshOptions } = cookieOptions;
    return refreshOptions;
  }

  private getCookieOptions() {
    return {
      domain: this._cookieConfig.domain,
      path: '/',
      httpOnly: true,
      maxAge: Number(this._authConfig.jwtRefreshExpiresIn) * 1000,
      sameSite: 'none' as const,
      secure: true,
      signed: true,
    };
  }
}
