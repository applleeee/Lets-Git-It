import { UserResponseDto } from '../application/dtos/user.response.dto';
import { User as UserOrmEntity } from '../database/entity/user.orm-entity';
import { UserEntity } from '../domain/user.entity';
import { Mapper } from 'src/libs/base/mapper.interface';

export class UserMapper
  implements Mapper<UserEntity, UserOrmEntity, UserResponseDto>
{
  toPersistence(entity: UserEntity): UserOrmEntity {
    const copy = entity.getProps();

    const record = new UserOrmEntity();
    record.id = copy.id as string;
    record.githubId = copy.githubId;
    record.fieldId = copy.fieldId;
    record.careerId = copy.careerId;
    record.isKorean = copy.isKorean;
    record.isAdmin = copy.isAdmin;
    record.hashedRefreshToken = copy.hashedRefreshToken;
    record.createdAt = copy.createdAt;
    record.updatedAt = copy.updatedAt;

    return record;
  }

  toDomain(record: UserOrmEntity): UserEntity {
    const entity = new UserEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      props: {
        githubId: record.githubId,
        fieldId: record.fieldId,
        careerId: record.careerId,
        isAdmin: record.isAdmin,
        isKorean: record.isKorean,
      },
    });
    return entity;
  }

  toResponse(entity: UserEntity): UserResponseDto {
    const props = entity.getProps();
    const response = new UserResponseDto();
    response.id = props.id as string;
    response.githubId = props.githubId;
    response.fieldId = props.fieldId;
    response.careerId = props.careerId;
    response.isAdmin = props.isAdmin;
    response.isKorean = props.isKorean;

    return response;
  }
}
