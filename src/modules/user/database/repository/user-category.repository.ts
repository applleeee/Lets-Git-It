import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Career } from '../entity/career.orm-entity.js';
import { Field } from '../entity/field.orm-entity.js';
import { UserCategoryMapper } from '../../mapper/user-category.mapper.js';
import { UserCategoryRepositoryPort } from '../user-category.repository.port.js';

export interface UserCategoryOrmEntity {
  field: Field[];
  career: Career[];
}

export class UserCategoryRepository implements UserCategoryRepositoryPort {
  constructor(
    @InjectRepository(Career)
    private readonly _careerRepository: Repository<Career>,
    @InjectRepository(Field)
    private readonly _fieldRepository: Repository<Field>,
    private readonly _mapper: UserCategoryMapper,
  ) {}

  async getUserCategory() {
    const userCategoryOrmEntity: UserCategoryOrmEntity = {
      field: await this._fieldRepository.find(),
      career: await this._careerRepository.find(),
    };

    return this._mapper.toDomain(userCategoryOrmEntity);
  }
}
