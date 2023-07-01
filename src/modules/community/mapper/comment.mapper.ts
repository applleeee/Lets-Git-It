import { Mapper } from 'src/libs/base/mapper.interface';
import { CommentEntity } from '../domain/comment.entity';
import { Comment as CommentOrmEntity } from 'src/modules/entities/Comment';

export class CommentMapper implements Mapper<CommentEntity, CommentOrmEntity> {
  toPersistence(entity: CommentEntity): CommentOrmEntity {
    const copy = entity.getProps();

    const record = new CommentOrmEntity();

    record.id = copy.id as string;
    record.content = copy.content;
    record.groupOrder = copy.groupOrder;
    record.depth = copy.depth;
    record.userId = copy.userId;
    record.postId = copy.postId;
    record.createdAt = copy.createdAt;
    record.updatedAt = copy.updatedAt;

    return record;
  }

  toDomain(record: CommentOrmEntity): CommentEntity {
    const entity = new CommentEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      props: {
        content: record.content,
        groupOrder: record.groupOrder,
        depth: record.depth,
        userId: record.userId,
        postId: record.postId,
      },
    });
    return entity;
  }

  toResponse(entity: CommentEntity) {
    return;
  }
}
