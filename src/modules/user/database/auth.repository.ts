import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Career } from './career.orm-entity.js';
import { Field } from './field.orm-entity.js';

export class AuthRepository {
  constructor(
    @InjectRepository(Career)
    private readonly careerRepository: Repository<Career>,
    @InjectRepository(Field)
    private readonly fieldRepository: Repository<Field>,
  ) {}

  async getAuthCategory() {
    return {
      field: await this.fieldRepository.find(),
      career: await this.careerRepository.find(),
    };
  }
}
