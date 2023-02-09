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

  // 로그인 검증 추가
  @Post('/post')
  async createPost(
    @UploadedFile('content') content: any,
    @Body() postData: CreatePostDto,
  ) {
    const userId = 1;
    return await this.communityService.createPost(postData, content, userId);
  }

  @Get('/posts/list/:subCategoryId')
  async getPostList(
    @Param('subCategoryId', ValidateSubCategoryIdPipe) subCategoryId: number,
  ) {
    return await this.communityService.getPostList(subCategoryId);
  }

  //로그인 검증 추가
  @Post('/like')
  async createOrDeletePostLike(@Body() data) {
    const userId = 1;
    const result = await this.communityService.createOrDeletePostLike(
      data,
      userId,
    );
    if (result['raw']) {
      return { message: 'like deleted' };
    } else {
      return { message: 'like created' };
    }
  }
}
