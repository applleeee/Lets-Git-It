import {
  Controller,
  Get,
  Post,
  Body,
  UploadedFile,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreatePostDto } from './dto/createPost.dto';
import { ValidateSubCategoryIdPipe } from './pipe/getPostList.pipe';

@Controller('/community')
export class CommunityController {
  constructor(private communityService: CommunityService) {}

  @Get('/categories')
  async getAllCategories() {
    return await this.communityService.getAllCategories();
  }

  @Post('/post')
  async createPost(
    @UploadedFile('content') content: any,
    @Body() postData: CreatePostDto,
  ) {
    return await this.communityService.createPost(postData, content);
  }

  @Get('/posts/list/:subCategoryId')
  async getPostList(
    @Param('subCategoryId', ValidateSubCategoryIdPipe) subCategoryId: number,
  ) {
    return await this.communityService.getPostList(subCategoryId);
  }
}
