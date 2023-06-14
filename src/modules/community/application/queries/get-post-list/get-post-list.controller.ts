import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ValidateSubCategoryIdPipe } from './get-post-list-pipe';
import { GetPostListDto } from './get-post-list.request.dto';
import { GetPostListQuery } from './get-post-list.query';
import { GetPostListResponseDto } from '../../res-dto/get-post-list.response.dto';

@Controller('/community')
export class GetPostListController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/posts/list/:subCategoryId')
  async getPostList(
    @Param('subCategoryId', ValidateSubCategoryIdPipe) subCategoryId: number,
    @Query() queryParams: GetPostListDto,
  ): Promise<GetPostListResponseDto> {
    const query = new GetPostListQuery({ subCategoryId, queryParams });
    return await this.queryBus.execute(query);
  }
}
