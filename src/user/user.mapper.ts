import { map } from 'rxjs';
import { GetUserResponseDto } from './application/dtos/get-user.response.dto';
import { User as UserOrmEntity } from './database/user.orm-entity';
import { UserEntity } from './domain/user.entity';

export class UserMapper {
  toPersistence(entity: UserEntity): UserOrmEntity {
    const copy = entity.getProps();

    const record = new UserOrmEntity();
    record.id = copy.id;
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

  // todo 추후 구현
  // toDomain(record: UserOrmEntity): UserEntity {
  //   const entity = new UserEntity({
  //     id: record.id,
  //     createdAt: new Date(record.createdAt),
  //     updatedAt: new Date(record.updatedAt),
  //     props: {},
  //   });
  //   return entity;
  // }

  // todo 추후 구현
  // toResponse(entity: UserEntity): GetUserResponseDto {
  //   const props = entity.getProps();
  //   const response = new GetUserResponseDto();

  //   return response;
  // }
}
