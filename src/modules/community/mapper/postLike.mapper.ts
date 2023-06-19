import { Mapper } from 'src/libs/base/mapper.interface';
import { PostLike as PostLikeOrmEntity } from 'src/modules/entities/PostLike';
import { PostLikeEntity } from '../domain/postLike.entity';

export class PostLikeMapper
  implements Mapper<PostLikeEntity, PostLikeOrmEntity>
{
  toPersistence(entity: PostLikeEntity): PostLikeOrmEntity {
    const copy = entity.getProps();

    const record = new PostLikeOrmEntity();

    record.id = copy.id as string;
    record.postId = copy.postId;
    record.userId = copy.userId;
    record.createdAt = copy.createdAt;
    record.updatedAt = copy.updatedAt;

    return record;
  }

  toDomain(record: PostLikeOrmEntity): PostLikeEntity {
    const entity = new PostLikeEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      props: {
        userId: record.userId,
        postId: record.postId,
      },
    });
    return entity;
  }

  toResponse(entity: PostLikeEntity) {
    return;
  }
}
