import { CommunityRepository } from '../../community/community.repository';
import { RankerProfileRepository } from '../../rank/rankerProfile.repository';
import { promisify } from 'util';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { pbkdf2 } from 'crypto';
import { UserRepository } from '../database/repository/user.repository';
import { GetUserResponseDto } from './dtos/get-user.response.dto';
import { USER_REPOSITORY } from '../user.di-tokens';
import { User } from '../database/entity/user.orm-entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly _userRepository: UserRepository,

    private readonly rankerProfileRepository: RankerProfileRepository,
    private readonly communityRepository: CommunityRepository,
  ) {}

  async getUserByGithubId(githubId: number): Promise<User> {
    return await this._userRepository.getUserByGithubId(githubId);
  }

  async getById(id: string): Promise<User> {
    return await this._userRepository.getByUserId(id);
  }

  // async createUser(signUpData: SignUpRequestDto) {
  //   await this._userRepository.createUser(signUpData);
  // }

  async getMyPage(userId: string) {
    // 유저네임, 프로필 텍스트, 이메일, 프로필 이미지, 티어 이름 -> RankerProfile
    const [ranker] = await this.rankerProfileRepository.getMyPage(userId);
    const { name, profileText, profileImageUrl, email } = ranker;
    const { tierName, tierImage } =
      await this.rankerProfileRepository.getUserTier(name);

    // 개발분야, 경력 -> User
    const { careerId, fieldId, isKorean } =
      await this._userRepository.getByUserId(userId);

    // 작성한 글 목록(제목, 카테고리, 날짜, id) -> Post
    const posts = await this.communityRepository.getPostsCreatedByUser(userId);

    const result: GetUserResponseDto = {
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

  async saveRefreshToken(refreshToken: string, userId: string) {
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

    return await this._userRepository.updateUserRefreshToken(
      userId,
      hashedRefreshToken,
    );
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, id: string) {
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

  async deleteRefreshToken(id: string) {
    return await this._userRepository.updateUserRefreshToken(id, null);
  }
}
