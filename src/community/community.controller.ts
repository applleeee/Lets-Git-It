import {
  Controller,
  Get,
  Post,
  Body,
  UploadedFile,
  Param,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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

  //로그인 검증 추가가
  @Post('/post/image')
  @UseInterceptors(FileInterceptor('image'))
  async saveImageToS3(@UploadedFile() image) {
    const userId = 1;
    try {
      await this.communityService.saveImageToS3(image, userId);
      return 'post save success';
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  // 로그인 검증 추가
  @Post('/post')
  async createPost(@Body() postData: CreatePostDto) {
    const userId = 1;
    try {
      return await this.communityService.createPost(postData, userId);
    } catch (err) {
      console.log(err);
      return err;
    }
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
