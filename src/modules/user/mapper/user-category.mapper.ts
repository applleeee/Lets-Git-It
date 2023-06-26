import { UserFieldEntity } from '../domain/user-category-field.entity';
import { UserCareerEntity } from '../domain/user-category-career.entity';
import { UserCategoryOrmEntity } from '../database/repository/user-category.repository';
import {
  CareerPeriod,
  FieldName,
  UserCategoryEntity,
} from '../domain/user-category.types';
import { UserCategoryDto } from '../application/dtos/user-category.response.dto';

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
    const fields = entity.field.map((field) => ({
      id: field.id,
      name: field.getProps().name,
    }));

    const careers = entity.career.map((career) => ({
      id: career.id,
      period: career.getProps().period,
    }));

    return new UserCategoryDto({ fields, careers });
  }
}
