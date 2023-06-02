import { BaseEntity } from 'src/libs/base/entity.base';
import { CreatePostProps, PostProps } from './community.types';
import { ulid } from 'ulid';

export class PostEntity extends BaseEntity<PostProps> {
  static create(createPostProps: CreatePostProps): PostEntity {
    const id = ulid();
    const props: PostProps = { ...createPostProps };
    return new PostEntity({ id, props });
  }
}
