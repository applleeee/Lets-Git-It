import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubCategory } from '../entities/SubCategory';

@Injectable()
export class CommunityRepository {
  constructor(
    @InjectRepository(SubCategory)
    private subCategoryRepository: Repository<SubCategory>,
  ) {}

  async getAllCategories() {
    const categories = await this.subCategoryRepository.find();
    console.log(categories);
    return categories;
  }
}
