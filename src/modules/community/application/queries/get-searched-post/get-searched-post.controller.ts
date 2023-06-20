import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { SearchPostDto } from './get-searched-post.request.dto';
import { GetSearchedPostQuery } from './get-searched-post.query';

@Controller('/community')
export class GetSearchedPostController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/search')
  async getSearchedPost(@Query() queryParams: SearchPostDto) {
    const query = new GetSearchedPostQuery({ queryParams });
    return await this.queryBus.execute(query);
  }
}
