import { promisify } from 'util';
import { RankerProfileRepository } from './../rank/rankerProfile.repository';
import { SignUpDto } from './dto/createUser.dto';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../entities/User';
import { UserRepository } from './user.repository';
import { lastValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { CommunityRepository } from '../community/community.repository';
import { MyPageDto, UpdateMyPageDto } from './dto/mypage.dto';
import { AxiosRequestConfig } from 'axios';
import { pbkdf2 } from 'crypto';

@Injectable()
export class UserService {
  constructor(
    private readonly http: HttpService,
    private readonly userRepository: UserRepository,
    private readonly rankerProfileRepository: RankerProfileRepository,
    private readonly communityRepository: CommunityRepository,
  ) {}

  async getByGithubId(githubId: number): Promise<User> {
    return await this.userRepository.getByGithubId(githubId);
  }

  async getById(id: number): Promise<User> {
    return await this.userRepository.getByUserId(id);
  }

  async getGithubAccessToken(code: string) {
    const requestBody = {
      code,
      client_id: process.env.AUTH_CLIENT_ID,
      client_secret: process.env.AUTH_CLIENT_SECRETS,
    };

    const config: AxiosRequestConfig = {
      headers: {
        accept: 'application/json',
      },
    };
    const result = await lastValueFrom(
      this.http
        .post(
          `https://github.com/login/oauth/access_token`,
          requestBody,
          config,
        )
        .pipe(map((res) => res.data.access_token)),
    );

    if (result === undefined) {
      throw new BadRequestException('WRONG_GITHUB_CODE');
    }
    return result;
  }

  async getByGithubAccessToken(githubAccessToken: string) {
    const config: AxiosRequestConfig = {
      headers: {
        accept: 'application/json',
        Authorization: `token ${githubAccessToken}`,
      },
    };
    const result = await lastValueFrom(
      this.http
        .get(`https://api.github.com/user`, config)
        .pipe(map((res) => res.data)),
    );
    if (result === undefined) {
      throw new NotFoundException('NOT_FOUND_GITHUB_USER');
    }
    return result;
  }

  async createUser(signUpData: SignUpDto) {
    await this.userRepository.createUser(signUpData);
  }

  async getMyPage(userId: number) {
    // 유저네임, 프로필 텍스트, 이메일, 프로필 이미지, 티어 이름 -> RankerProfile
    const [ranker] = await this.rankerProfileRepository.getMyPage(userId);
    const { name, profileText, profileImageUrl, email } = ranker;
    const { tierName, tierImage } =
      await this.rankerProfileRepository.getUserTier(name);

    // 개발분야, 경력 -> User
    const { careerId, fieldId, isKorean } =
      await this.userRepository.getByUserId(userId);

    // 작성한 글 목록(제목, 카테고리, 날짜, id) -> Post
    const posts = await this.communityRepository.getPostsCreatedByUser(userId);

    const result: MyPageDto = {
      userName: name,
      profileText,
      profileImageUrl,
      email,
      careerId,
      fieldId,
      isKorean,
      posts,
      tierName,
      tierImage,
    };
    return result;
  }

  async updateUser(userId: number, partialEntity: UpdateMyPageDto) {
    return await this.userRepository.updateUser(userId, partialEntity);
  }

  async saveRefreshToken(refreshToken: string, userId: number) {
    const salt = process.env.REFRESH_SALT;
    const iterations = +process.env.REFRESH_ITERATIONS;
    const keylen = +process.env.REFRESH_KEYLEN;
    const digest = process.env.REFRESH_DIGEST;
    const pbkdf2Promise = promisify(pbkdf2);
    const key = await pbkdf2Promise(
      refreshToken,
      salt,
      iterations,
      keylen,
      digest,
    );

    const hashedRefreshToken = key.toString('base64');

    return await this.userRepository.updateUserRefreshToken(
      userId,
      hashedRefreshToken,
    );
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, id: number) {
    const user = await this.getById(id);

    const isRefreshTokenMatching: boolean = await this.verifyRefreshToken(
      user.hashedRefreshToken,
      refreshToken,
    );

    if (isRefreshTokenMatching) {
      const userName = await this.rankerProfileRepository.getUserNameByUserId(
        id,
      );

      return { id, userName };
    }
  }

  async verifyRefreshToken(
    hashedRefreshToken: string,
    currentRefreshToken: string,
  ) {
    const salt = process.env.REFRESH_SALT;
    const iterations = +process.env.REFRESH_ITERATIONS;
    const keylen = +process.env.REFRESH_KEYLEN;
    const digest = process.env.REFRESH_DIGEST;
    const pbkdf2Promise = promisify(pbkdf2);
    const key = await pbkdf2Promise(
      currentRefreshToken,
      salt,
      iterations,
      keylen,
      digest,
    );
    const currentHashedRefreshToken = key.toString('base64');

    if (currentHashedRefreshToken !== hashedRefreshToken)
      throw new UnauthorizedException('UNAUTHORIZED');

    return true;
  }

  async deleteRefreshToken(id: number) {
    return await this.userRepository.updateUserRefreshToken(id, null);
  }
}
