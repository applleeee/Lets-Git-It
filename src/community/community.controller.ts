import {
  Controller,
  Get,
  Post,
  Body,
  UploadedFile,
  Param,
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
import { OptionalAuthGuard } from './guard/optionalGuard';

@Controller('/community')
export class CommunityController {
  constructor(private communityService: CommunityService) {}

  @Get('/categories')
  async getAllCategories() {
    return await this.communityService.getAllCategories();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/post/image')
  @UseInterceptors(FileInterceptor('image'))
  async saveImageToS3(@UploadedFile() image, @Req() req) {
    try {
      const userId: number = req.user.id;
      return await this.communityService.saveImageToS3(image, userId);
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/post')
  async createPost(@Body() postData: CreatePostDto, @Req() req) {
    try {
      const userId: number = req.user.id;
      await this.communityService.createPost(postData, userId);
      return { message: 'post created' };
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/posts/update/:postId')
  async getPostToUpdate(@Param('postId') postId: number, @Req() req) {
    const { idsOfPostsCreatedByUser } = req.user;
    try {
      if (idsOfPostsCreatedByUser.includes(postId)) {
        return await this.communityService.getPostToUpdate(postId);
      } else {
        return { message: 'This user has never written that post.' };
      }
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/posts/update/:postId')
  async updatePost(
    @Param('postId') postId: number,
    @Body() updatedData: CreatePostDto,
    @Req() req,
  ) {
    try {
      const userId = req.user.id;
      await this.communityService.updatePost(postId, updatedData, userId);
      return { message: 'post updated' };
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/posts/:postId')
  async deletePost(@Param('postId') postId: number, @Req() req) {
    const userId = req.user.id;
    return await this.communityService.deletePost(postId, userId);
  }

  @Get('/posts/list/:subCategoryId')
  async getPostList(
    @Param('subCategoryId', ValidateSubCategoryIdPipe) subCategoryId: number,
  ) {
    return await this.communityService.getPostList(subCategoryId);
  }

  @UseGuards(OptionalAuthGuard)
  @Get('/posts/:postId')
  async getPostDetail(@Param('postId') postId: number, @Req() req) {
    try {
      const result = await this.communityService.getPostDetail(postId);
      if (req.user) {
        const { idsOfPostLikedByUser } = req.user;
        result.login = true;
        console.log(req.user);
        if (idsOfPostLikedByUser.length === 0) {
          result.ifLiked = false;
        } else {
          result.ifLiked = true;
        }
        return result;
      }
      if (!req.user) {
        return result;
      }
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/like')
  async createOrDeletePostLike(@Body() data, @Req() req) {
    try {
      const userId = req.user.id;
      const result = await this.communityService.createOrDeletePostLike(
        data,
        userId,
      );
      if (result['raw']) {
        return { message: 'like deleted' };
      } else {
        return { message: 'like created' };
      }
    } catch (err) {
      console.log(err);
      return err;
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
