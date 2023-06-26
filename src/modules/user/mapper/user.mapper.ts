import { UserResponseDto } from '../application/dtos/user.response.dto';
import { User as UserOrmEntity } from '../database/entity/user.orm-entity';
import { CareerId } from '../domain/user-category.types';
import { FieldId } from '../domain/user-category.types';
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
    record.fieldId = copy.fieldId as unknown as number;
    record.careerId = copy.careerId as unknown as number;
    record.isKorean = copy.isKorean;
    record.isAdmin = copy.isAdmin;
    record.createdAt = copy.createdAt;
    record.updatedAt = copy.updatedAt;
    record.refreshTokenId = copy?.refreshTokenId;

    return record;
  }

  toDomain(record: UserOrmEntity): UserEntity {
    const entity = new UserEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      props: {
        githubId: record.githubId,
        fieldId: record.fieldId as unknown as FieldId,
        careerId: record.careerId as unknown as CareerId,
        isAdmin: record.isAdmin,
        isKorean: record.isKorean,
      },
    });
    return entity;
  }

  toResponse(entity: UserEntity): UserResponseDto {
    const props = entity.getProps();
    const response = new UserResponseDto({
      id: props.id as string,
      githubId: props.githubId,
      fieldId: props.fieldId,
      careerId: props.careerId,
      isAdmin: props.isAdmin,
      isKorean: props.isKorean,
    });

    return response;
  }
}
