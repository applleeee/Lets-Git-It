import { RefreshTokenEntity } from '../domain/refresh-token.entity';
import { RefreshToken as RefreshTokenOrmEntity } from '../database/refresh-token.orm-entity';
import { Mapper } from 'src/libs/base/mapper.interface';

export class RefreshTokenMapper
  implements Mapper<RefreshTokenEntity, RefreshTokenOrmEntity>
{
  toPersistence(entity: RefreshTokenEntity): RefreshTokenOrmEntity {
    const copy = entity.getProps();

    const record = new RefreshTokenOrmEntity();
    record.id = copy.id as string;
    record.hashedRefreshToken = copy.hashedRefreshToken;
    record.userId = copy.userId;
    record.createdAt = copy.createdAt;
    record.updatedAt = copy.updatedAt;

    return record;
  }

  toDomain(record: RefreshTokenOrmEntity): RefreshTokenEntity {
    const entity = new RefreshTokenEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      props: {
        hashedRefreshToken: record.hashedRefreshToken,
        userId: record.userId,
      },
    });
    return entity;
  }

  toResponse(entity: RefreshTokenEntity) {
    // const props = entity.getProps();
    // const response = {} as any;
    // response.id = props.id as string;
    // return response;
  }
}
