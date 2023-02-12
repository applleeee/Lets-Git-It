import {
  Controller,
  Get,
  Post,
  Body,
  UploadedFile,
  Param,
  ParseIntPipe,
  UseInterceptors,
  UseGuards,
  ValidationPipe,
  Req,
  Delete,
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommunityService } from './community.service';
import { CreatePostDto } from './dto/createPost.dto';
import {
  CreateCommentDto,
  CreateCommentLikesDto,
  DeleteCommentDto,
  UpdateCommentDto,
} from './dto/comment.dto';
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

  // 댓글생성
  @UseGuards(AuthGuard('jwt'))
  @Post('/posts/:post_id/comment')
  async createComment(
    @Body(ValidationPipe) body,
    @Req() req,
    @Param('post_id', ValidationPipe) postId,
  ) {
    const commentData: CreateCommentDto = {
      userId: req.user.id,
      postId,
      ...body,
    };
    await this.communityService.createComment(commentData);
    return { message: 'COMMENT_CREATED' };
  }

  // 댓글삭제
  @UseGuards(AuthGuard('jwt'))
  @Delete('/comments/:comment_id')
  async deleteComment(
    @Req() req,
    @Param('comment_id', ValidationPipe) commentId,
  ) {
    const creteria: DeleteCommentDto = { userId: req.user.id, id: commentId };
    await this.communityService.deleteComment(creteria);
    return { message: 'COMMENT_DELETED' };
  }

  // 댓글수정
  @UseGuards(AuthGuard('jwt'))
  @Put('/comments/:comment_id')
  async updateComment(
    @Req() req,
    @Param('comment_id', ValidationPipe) commentId,
    @Body() body,
  ) {
    const creteria: UpdateCommentDto = {
      userId: req.user.id,
      id: commentId,
    };
    const toUpdateContent: string = body.content;
    await this.communityService.updateComment(creteria, toUpdateContent);
    return { message: 'COMMENT_UPDATED' };
  }

  // 댓글조회
  @Get('/posts/:post_id/comments')
  async getComments(@Param('post_id', ValidationPipe) postId) {
    return await this.communityService.readComments(postId);
  }
  // 댓글좋아요 생성/삭제
  @UseGuards(AuthGuard('jwt'))
  @Post('/comments/:comment_id/likes')
  async createCommentLikes(
    @Req() req,
    @Param('comment_id', ValidationPipe) commentId,
  ) {
    const creteria: CreateCommentLikesDto = {
      userId: req.user.id,
      commentId,
    };

    await this.communityService.createCommentLikes(creteria);
  }
}
