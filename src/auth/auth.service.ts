import {
  AuthSignInOkResDto,
  AuthSignInUnauthorizedResDto,
} from './dto/auth-res.dto';
import { UserRepository } from './../user/user.repository';
import { RankService } from './../rank/rank.service';
import { UserService } from './../user/user.service';
import { RankerProfileRepository } from '../rank/rankerProfile.repository';
import { AuthRepository } from './auth.repository';
import { Injectable } from '@nestjs/common';
import { GithubCodeDto, SignUpWithUserNameDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { jwtConstants, cookieConstants } from './constants';
dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly rankService: RankService,
    private readonly userRepository: UserRepository,
    private readonly rankerProfileRepository: RankerProfileRepository,
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

    const updateRankerProfileDto = {
      profileImageUrl: ranker.profileImage,
      homepageUrl: ranker.blog,
      email: ranker.email,
      company: ranker.company,
      region: ranker.region,
      userId: userId,
    };
    await this.rankerProfileRepository.updateRankerProfile(
      userName,
      updateRankerProfileDto.profileImageUrl,
      updateRankerProfileDto.homepageUrl,
      updateRankerProfileDto.email,
      updateRankerProfileDto.company,
      updateRankerProfileDto.region,
      updateRankerProfileDto.userId,
    );

    return { accessToken: jwtToken, userId: user.id };
  }

  async getAuthCategory() {
    return await this.authRepository.getAuthCategory();
  }

  async getJwtAccessToken(userId: number, userName: string) {
    const payload = { userId, userName };
    return this.jwtService.sign(payload, {
      secret: jwtConstants.jwtSecret,
      expiresIn: `${jwtConstants.jwtExpiresIn}s`,
    });
  }

  async getCookiesWithJwtRefreshToken(userId: number) {
    const payload = { userId };
    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtConstants.jwtRefreshSecret,
      expiresIn: `${jwtConstants.jwtRefreshExpiresIn}s`,
    });

    return { refreshToken, ...cookieConstants };
  }

  async getCookiesForLogOut() {
    const { maxAge, ...refreshOptions } = cookieConstants;
    return refreshOptions;
  }
}
