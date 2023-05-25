import { UserRepository } from './../user/user.repository';
import { RankService } from './../rank/rank.service';
import { UserService } from './../user/user.service';
import { RankerProfileRepository } from '../rank/rankerProfile.repository';
import { AuthRepository } from './auth.repository';
import { Inject, Injectable } from '@nestjs/common';
import { GithubCodeDto, SignUpWithUserNameDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { ConfigType } from '@nestjs/config';
import authConfig from '../config/authConfig';
import cookieConfig from '../config/cookieConfig';

@Injectable()
export class AuthService {
  constructor(
    private readonly http: HttpService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly rankService: RankService,
    private readonly userRepository: UserRepository,
    private readonly rankerProfileRepository: RankerProfileRepository,
    @Inject(cookieConfig.KEY)
    private readonly _cookieConfig: ConfigType<typeof cookieConfig>,
    @Inject(authConfig.KEY)
    private readonly _authConfig: ConfigType<typeof authConfig>,
  ) {}

  async signIn(githubCode: GithubCodeDto) {
    const { code } = githubCode;

    const githubAccessToken = await this.userService.getGithubAccessToken(code);

    const githubUserInfo = await this.userService.getByGithubAccessToken(
      githubAccessToken,
    );

    const userName = githubUserInfo.login;
    const user = await this.userService.getByGithubId(githubUserInfo.id);

    if (!user) {
      return {
        isMember: false,
        userName: userName,
        githubId: githubUserInfo.id,
      };
    }

    const jwtToken = await this.getJwtAccessToken(user.id, userName);

    return {
      isMember: true,
      userName: userName,
      accessToken: jwtToken,
      userId: user.id,
    };
  }

  async signUp(signUpDataWithUserName: SignUpWithUserNameDto) {
    const { userName, ...signUpData } = signUpDataWithUserName;
    await this.userService.createUser(signUpData);

    const user = await this.userService.getByGithubId(signUpData.githubId);

    const jwtToken = await this.getJwtAccessToken(user.id, userName);

    await this.rankService.checkRanker(userName);

    const userId = await this.userRepository.getUserIdByGithubId(user.githubId);

    const ranker = await this.rankerProfileRepository.getRankerProfile(
      userName,
    );

    await this.rankerProfileRepository.updateRankerProfile(
      userName,
      ranker.profileImage,
      ranker.blog,
      ranker.email,
      ranker.company,
      ranker.region,
      userId,
    );

    return { accessToken: jwtToken, userId: user.id };
  }

  async getAuthCategory() {
    return await this.authRepository.getAuthCategory();
  }

  async getJwtAccessToken(userId: number, userName: string) {
    const payload = { userId, userName };
    return this.jwtService.sign(payload, {
      secret: this._authConfig.jwtSecret,
      expiresIn: `${this._authConfig.jwtExpiresIn}s`,
    });
  }

  async getCookiesWithJwtRefreshToken(userId: number) {
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
