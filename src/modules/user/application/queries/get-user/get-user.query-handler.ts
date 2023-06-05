import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserRepositoryPort } from 'src/modules/user/database/user.repository.port';
import { USER_REPOSITORY } from 'src/modules/user/user.di-tokens';
import { GetUserQuery } from './get-user.query';

@Injectable()
@QueryHandler(GetUserQuery)
export class GetUserQueryHandler implements IQueryHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly _userRepository: UserRepositoryPort,
  ) {}

  async execute(query: any): Promise<any> {
    const { id } = query;

    // 개발분야, 경력 -> User
    const user = await this._userRepository.findOneById(id);

    const { fieldId, careerId, isKorean } = user.getProps();

    // 유저네임, 프로필 텍스트, 이메일, 프로필 이미지, 티어 이름 -> RankerProfile
    // const [ranker] = await this.rankerProfileRepository.getMyPage(userId);
    // const { name, profileText, profileImageUrl, email } = ranker;
    // const { tierName, tierImage } =
    //   await this.rankerProfileRepository.getUserTier(name);

    // // 작성한 글 목록(제목, 카테고리, 날짜, id) -> Post
    // const posts = await this.communityRepository.getPostsCreatedByUser(userId);

    // const result: GetUserResponseDto = {
    //   userName: name,
    //   profileText,
    //   profileImageUrl,
    //   email,
    //   careerId,
    //   fieldId,
    //   isKorean,
    //   posts,
    //   tierName,
    //   tierImage,
    // };
    // return result;
    // }
  }
}
