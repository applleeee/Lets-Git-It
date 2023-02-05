import { Controller, Get, Post, Body, UploadedFile } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreatePostDto } from './dto/createPost.dto';

@Controller('/community')
export class CommunityController {
  constructor(private communityService: CommunityService) {}

  @Get('/categories')
  async getAllCategories() {
    const categories = await this.communityService.getAllCategories();
    return categories;
  }

  @Post('/post')
  async createPost(
    @UploadedFile('content') content: any,
    @Body() postData: CreatePostDto,
  ) {
    return await this.communityService.createPost(postData, content);
  }
}
