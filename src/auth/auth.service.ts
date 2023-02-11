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
    // 1. code로 access token 받기
    const githubAccessToken = await this.userService.getGithubAccessToken(code);

    // 2. access token으로 유저 github id 받기
    const githubUserInfo = await this.userService.getByGithubAccessToken(
      githubAccessToken,
    );

    // 3. github id가 db에 있는지 확인하기
    const user = await this.userService.getByGithubId(githubUserInfo.id);
    // 4-a. 있다면 userid로 jwt 만들기
    if (user) {
      return {
        accessToken: this.jwtService.sign({
          userId: user.id,
          secretOrPrivateKey: process.env.JWT_SECRET_KEY,
        }),
      };
    }
    // 4-a. 없다면 isMemeber false 반환
    return { isMember: false, githubId: githubUserInfo.id };
  }

  async signUp(signUpData: SignUpDto) {
    // 1. 받아온 정보로 회원가입 시키고
    await this.userService.createUser(signUpData);
    const user = await this.userService.getByGithubId(signUpData.githubId);
    // 2. jwt token 발급
    return {
      accessToken: this.jwtService.sign({
        userId: user.id,
        secretOrPrivateKey: process.env.JWT_SECRET_KEY,
      }),
    };
  }

  async getAuthCategory() {
    return await this.authRepository.getAuthCategory();
  }
}
