import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetAllPostCategoriesQuery } from './get-all-post-categories.query-handler';
import { SubCategory } from 'src/entities/SubCategory';

@Controller('/community')
export class GetAllPostCategoriesController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/categories')
  async getAllPostCategories(): Promise<SubCategory[]> {
    return await this.queryBus.execute(new GetAllPostCategoriesQuery());
  }
}
