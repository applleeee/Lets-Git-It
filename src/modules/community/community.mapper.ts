import { Mapper } from 'src/libs/base/mapper.interface';
import { PostEntity } from './domain/community.entity';
import { Post as PostOrmEntity } from '../entities/Post';
import { PostResponseDto } from './application/res-dto/post.response.dto';

export class PostMapper
  implements Mapper<PostEntity, PostOrmEntity, PostResponseDto>
{
  toPersistence(entity: PostEntity): PostOrmEntity {
    const copy = entity.getProps();

    const record = new PostOrmEntity();

    record.id = copy.id;
    record.title = copy.title;
    record.contentUrl = copy.contentUrl;
    record.userId = copy.userId;
    record.subCategoryId = copy.subCategoryId;
    record.createdAt = copy.createdAt;
    record.updatedAt = copy.updatedAt;

    return record;
  }

  toDomain(record: PostOrmEntity): PostEntity {
    const entity = new PostEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      props: {
        title: record.title,
        contentUrl: record.contentUrl,
        userId: record.userId,
        subCategoryId: record.subCategoryId,
      },
    });
    return entity;
  }

  toResponse(entity: PostEntity): PostResponseDto {
    const props = entity.getProps();

    const response = new PostResponseDto();
    response.id = props.id;
    response.title = props.title;
    response.contentUrl = props.contentUrl;
    response.userId = props.userId;
    response.subCategoryId = props.subCategoryId;
    response.fixedCategoryId = props.fixedCategoryId;

    return response;
  }
}
