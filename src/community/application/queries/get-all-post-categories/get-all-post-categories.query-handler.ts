import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { SubCategory } from 'src/entities/SubCategory';
import { Repository } from 'typeorm';

export class GetAllPostCategoriesQuery {
  constructor() {}
}

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
