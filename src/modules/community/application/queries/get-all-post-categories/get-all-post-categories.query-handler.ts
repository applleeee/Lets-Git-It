import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { SubCategory } from 'src/modules/entities/SubCategory';
import { Repository } from 'typeorm';
import { GetAllPostCategoriesQuery } from './get-all-post-categories.query';

@QueryHandler(GetAllPostCategoriesQuery)
export class GetAllCategoriesQueryHandler implements IQueryHandler {
  constructor(
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,
  ) {}

  async execute(): Promise<SubCategory[]> {
    return await this.subCategoryRepository.find();
  }
}
