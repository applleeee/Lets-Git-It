import { UserFieldEntity } from '../domain/user-category-field.entity';
import { UserCareerEntity } from '../domain/user-category-career.entity';
import { UserCategoryOrmEntity } from '../database/repository/user-category.repository';
import {
  CareerPeriod,
  FieldName,
  UserCategoryEntity,
} from '../domain/user-category.types';

export class UserCategoryMapper {
  toDomain(record: UserCategoryOrmEntity): UserCategoryEntity {
    const field = record.field.map(
      (field) =>
        new UserFieldEntity({
          id: field.id,
          createdAt: field.createdAt,
          updatedAt: field.updatedAt,
          props: { name: field.name as unknown as FieldName },
        }),
    );

    const career = record.career.map(
      (career) =>
        new UserCareerEntity({
          id: career.id,
          createdAt: career.createdAt,
          updatedAt: career.updatedAt,
          props: { period: career.period as unknown as CareerPeriod },
        }),
    );

    const result: UserCategoryEntity = { field, career };

    return result;
  }

  toPersistence(entity: UserCategoryEntity): UserCategoryOrmEntity {
    return;
  }

  toResponse(entity: UserCategoryEntity) {
    return;
  }
}
