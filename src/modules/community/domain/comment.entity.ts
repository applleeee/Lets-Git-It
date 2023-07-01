import { BaseEntity } from 'src/libs/base/entity.base';
import { CommentProps, CreateCommentProps } from './comment.types';
import { ulid } from 'ulid';

export class CommentEntity extends BaseEntity<CommentProps> {
  static create(createCommentProps: CreateCommentProps): CommentEntity {
    const id = ulid();
    const props = { ...createCommentProps };

    return new CommentEntity({ id, props });
  }
}
