import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { SubCategory } from 'src/modules/entities/SubCategory';
import { GetAllPostCategoriesQuery } from './get-all-post-categories.query';

@Controller('/community')
export class GetAllPostCategoriesController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/categories')
  async getAllPostCategories(): Promise<SubCategory[]> {
    return await this.queryBus.execute(new GetAllPostCategoriesQuery());
  }
}
