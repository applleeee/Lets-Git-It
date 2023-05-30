import { Comment } from '../../entities/comment.orm-entity';
import { Post } from '../../entities/post.orm-entity';

export class AuthorizedUser {
  readonly id: string;
  readonly userName: string;
  readonly idsOfPostsCreatedByUser?: Post[];
  readonly idsOfPostLikedByUser?: number[];
  readonly idsOfCommentsCreatedByUser?: Comment[];
  readonly idsOfCommentLikedByUser?: number[];
}

//todo auth 도메인 만들 때 정의하고 사용하기
export interface JwtAccessTokenPayload {
  id: number;
}

export interface JwtRefreshTokenPayload {
  id: number;
}
