import { RepositoryPort } from 'src/libs/base/repository.port';
import { CommentEntity } from '../domain/comment.entity';

export interface CommentRepositoryPort extends RepositoryPort<CommentEntity> {
  getCommentsWithPostId(postId: string);

  getReCommentsWithPostId(postId: string);
}
