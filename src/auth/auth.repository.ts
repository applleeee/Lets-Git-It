import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Career } from '../entities/Career';
import { Field } from 'src/entities/Field';

export class AuthRepository {
  constructor(
    @InjectRepository(Career)
    private readonly careerRepository: Repository<Career>,
    @InjectRepository(Field)
    private readonly fieldRepository: Repository<Field>,
  ) {}

  async getAuthCategory() {
    const data = {
      field: await this.fieldRepository.find(),
      career: await this.careerRepository.find(),
    };
    return data;
  }
}
