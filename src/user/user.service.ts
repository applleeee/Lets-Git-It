import { RankerProfileRepository } from './../rank/rank_profile.repository';
import { SignUpDto } from './../auth/dto/auth.dto';
import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/User';
import { UserRepository } from './user.repository';
import { lastValueFrom, map } from 'rxjs';
import * as dotenv from 'dotenv';
import { HttpService } from '@nestjs/axios';
import { CommunityRepository } from 'src/community/community.repository';
import { myPageDto } from './dto/mypage.dto';
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

  async getGithubAccessToken(code: string): Promise<unknown> {
    const requestBody = {
      code,
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRETS,
    };

    return await lastValueFrom(
      this.http
        .post(`https://github.com/login/oauth/access_token`, requestBody, {
          headers: {
            accept: 'application/json',
          },
        })
        .pipe(map((res) => res.data?.access_token)),
    );
  }

  async getByGithubAccessToken(githubAccessToken: unknown) {
    return await lastValueFrom(
      this.http
        .get(`https://api.github.com/user`, {
          headers: {
            accept: 'application/json',
            Authorization: `token ${githubAccessToken}`,
          },
        })
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
    const { careerId, fieldId } = await this.userRepository.getByUserId(userId);
    // 작성한 글 목록(제목, 카테고리, 날짜, id) -> Post
    const posts = await this.communityRepository.getPostsCreatedByUser(userId);

    const result: myPageDto = {
      userName,
      profileText,
      profileImageUrl,
      email,
      careerId,
      fieldId,
      posts,
    };
    return result;
  }

  async updateMyPage(userId: number, fieldId: number, careerId: number) {
    await this.userRepository.updateMyPage(userId, fieldId, careerId);
  }
}
