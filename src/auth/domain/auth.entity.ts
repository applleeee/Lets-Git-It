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
