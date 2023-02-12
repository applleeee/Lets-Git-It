import { RankerProfileRepository } from './../rank/rank_profile.repository';
import { SignUpDto } from './../auth/dto/auth.dto';
import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/User';
import { UserRepository } from './user.repository';
import { lastValueFrom, map } from 'rxjs';
import * as dotenv from 'dotenv';
import { HttpService } from '@nestjs/axios';
import { CommunityRepository } from 'src/community/community.repository';
import { MyPageDto, UpdateMyPageDto } from './dto/mypage.dto';
import { AxiosRequestConfig } from 'axios';
dotenv.config();

@Injectable()
export class UserService {
  constructor(
    private readonly http: HttpService,
    private readonly userRepository: UserRepository,
    private readonly rankerProfileRepository: RankerProfileRepository,
    private readonly communityRepository: CommunityRepository,
  ) {}
  // todo refactoring : getUser 메서드 getUserByKeyword로 통합
  async getByGithubId(githubId: number): Promise<User> {
    return await this.userRepository.getByGithubId(githubId);
  }

  async getById(id: number): Promise<User> {
    return await this.userRepository.getByUserId(id);
  }

  async getGithubAccessToken(code: string) {
    const requestBody = {
      code,
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRETS,
    };

    const config: AxiosRequestConfig = {
      headers: {
        accept: 'application/json',
      },
    };
    return await lastValueFrom(
      this.http
        .post(
          `https://github.com/login/oauth/access_token`,
          requestBody,
          config,
        )
        .pipe(map((res) => res.data?.access_token)),
    );
  }

  async getByGithubAccessToken(githubAccessToken: string) {
    const config: AxiosRequestConfig = {
      headers: {
        accept: 'application/json',
        Authorization: `token ${githubAccessToken}`,
      },
    };
    return await lastValueFrom(
      this.http
        .get(`https://api.github.com/user`, config)
        .pipe(map((res) => res.data)),
    );
  }

  async createUser(signUpData: SignUpDto) {
    await this.userRepository.createUser(signUpData);
  }

  async getMyPage(userId: number) {
    // 유저네임, 프로필 텍스트, 이메일, 프로필 이미지 -> RankerProfile
    const { userName, profileText, profileImageUrl, email } =
      await this.rankerProfileRepository.getMyPage(userId);
    // 개발분야, 경력 -> User
    const { careerId, fieldId, isKorean } =
      await this.userRepository.getByUserId(userId);
    // 작성한 글 목록(제목, 카테고리, 날짜, id) -> Post
    const posts = await this.communityRepository.getPostsCreatedByUser(userId);

    const result: MyPageDto = {
      userName,
      profileText,
      profileImageUrl,
      email,
      careerId,
      fieldId,
      isKorean,
      posts,
    };
    return result;
  }

  async updateMyPage(userId: number, partialEntity: UpdateMyPageDto) {
    await this.userRepository.updateMyPage(userId, partialEntity);
  }
}
