import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';
import { GithubCodeDto, SignUpDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { AuthRepository } from './auth.repository';
dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
  ) {}

  async signIn(githubCode: GithubCodeDto) {
    const { code } = githubCode;

    const githubAccessToken = await this.userService.getGithubAccessToken(code);

    const githubUserInfo = await this.userService.getByGithubAccessToken(
      githubAccessToken,
    );

    const user = await this.userService.getByGithubId(githubUserInfo.id);

    if (user) {
      const jwtToken = this.jwtService.sign({
        userId: user.id,
        secretOrPrivateKey: process.env.JWT_SECRET_KEY,
      });

      return { isMemeber: true, accessToken: jwtToken };
    }

    return { isMember: false, githubId: githubUserInfo.id };
  }

  async signUp(signUpData: SignUpDto) {
    await this.userService.createUser(signUpData);

    const user = await this.userService.getByGithubId(signUpData.githubId);

    const jwtToken = this.jwtService.sign({
      userId: user.id,
      secretOrPrivateKey: process.env.JWT_SECRET_KEY,
    });

    return { accessToken: jwtToken };
  }

  async getAuthCategory() {
    return await this.authRepository.getAuthCategory();
  }
}
