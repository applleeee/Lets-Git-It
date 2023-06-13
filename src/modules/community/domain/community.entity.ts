import { BaseEntity } from 'src/libs/base/entity.base';
import { CreatePostProps, PostProps, UpdatePostProps } from './community.types';
import { ulid } from 'ulid';

export class PostEntity extends BaseEntity<PostProps> {
  static create(createPostProps: CreatePostProps): PostEntity {
    const id = ulid();
    const props: PostProps = { ...createPostProps };
    return new PostEntity({ id, props });
  }

  update(updatePostProps: UpdatePostProps): void {
    this.props.title = updatePostProps.title;
    this.props.contentUrl = updatePostProps.contentUrl;
    this.props.subCategoryId = updatePostProps.subCategoryId;
  }
}
