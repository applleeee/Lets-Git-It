import { Comment } from './../../entities/Comment';
import { Post } from './../../entities/Post';

export class AuthorizedUser {
  readonly id: number;
  readonly userName: string;
  readonly idsOfPostsCreatedByUser?: Post[];
  readonly idsOfPostLikedByUser?: number[];
  readonly idsOfCommentsCreatedByUser?: Comment[];
  readonly idsOfCommentLikedByUser?: number[];
}
