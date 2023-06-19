import { BaseEntity } from 'src/libs/base/entity.base';
import { CreatePostLikeProps, PostLikeProps } from './postLike.types';
import { ulid } from 'ulid';

export class PostLikeEntity extends BaseEntity<PostLikeProps> {
  static create(createPostLikeProps: CreatePostLikeProps): PostLikeEntity {
    const id = ulid();
    const props: PostLikeProps = { ...createPostLikeProps };

    return new PostLikeEntity({ id, props });
  }
}
