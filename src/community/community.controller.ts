import {
  Controller,
  Get,
  Post,
  Body,
  UploadedFile,
  Param,
  UseInterceptors,
  UseGuards,
  Req,
  Delete,
  Put,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommunityService } from './community.service';
import { CreatePostDto } from './dto/createPost.dto';
import {
  CreateCommentBodyDto,
  CreateCommentDto,
  CreateCommentLikesDto,
  DeleteCommentDto,
  UpdateCommentBodyDto,
  UpdateCommentDto,
} from './dto/comment.dto';
import { ValidateSubCategoryIdPipe } from './pipe/getPostList.pipe';
import { OptionalAuthGuard } from './guard/optionalGuard';
import { GetPostListDto } from './dto/getPostList.dto';
import { SearchDto } from './dto/searchPost.dto';

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
  @Delete('/post/image')
  async deleteImageInS3(@Body() toDeleteImageData) {
    return await this.communityService.deleteImageInS3(toDeleteImageData);
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
    const { idsOfPostsCreatedByUser } = req.user;
    const userId = req.user.id;
    try {
      if (idsOfPostsCreatedByUser.includes(postId)) {
        await this.communityService.updatePost(postId, updatedData, userId);
        return { message: 'post updated' };
      } else {
        return { message: 'This user has never written that post.' };
      }
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/posts/:postId')
  async deletePost(@Param('postId') postId: number, @Req() req) {
    const { idsOfPostsCreatedByUser } = req.user;
    console.log(idsOfPostsCreatedByUser);
    if (idsOfPostsCreatedByUser.includes(postId)) {
      const result = await this.communityService.deletePost(postId);
      if (result.affected === 0) {
        throw new NotFoundException(`Could not find a post with id ${postId}`);
      }
      return { message: 'post deleted' };
    } else {
      throw new NotFoundException('This user has never written that post.');
    }
  }

  @Get('/posts/list/:subCategoryId')
  async getPostList(
    @Param('subCategoryId', ValidateSubCategoryIdPipe) subCategoryId: number,
    @Query() query: GetPostListDto,
  ) {
    return await this.communityService.getPostList(subCategoryId, query);
  }

  @UseGuards(OptionalAuthGuard)
  @Get('/posts/:postId')
  async getPostDetail(@Param('postId') postId: number, @Req() req) {
    try {
      const result = await this.communityService.getPostDetail(postId);
      if (req.user) {
        const { idsOfPostLikedByUser, idsOfPostsCreatedByUser } = req.user;
        result.isLogin = true;
        if (idsOfPostsCreatedByUser.includes(postId)) {
          result.isAuthor = true;
        } else {
          result.isAuthor = false;
        }
        if (idsOfPostLikedByUser.includes(postId)) {
          result.ifLiked = true;
        } else {
          result.ifLiked = false;
        }
        return result;
      }
      if (!req.user) {
        result.isLogin = false;
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

  @Get('/search')
  async searchPost(@Query() query: SearchDto) {
    return await this.communityService.searchPost(query);
  }

  // 댓글생성
  @UseGuards(AuthGuard('jwt'))
  @Post('/posts/:post_id/comment')
  async createComment(
    @Body() body: CreateCommentBodyDto,
    @Req() req,
    @Param('post_id') postId: number,
  ) {
    const commentData: CreateCommentDto = {
      userId: req.user.id,
      postId,
      ...body,
    };
    return await this.communityService.createComment(commentData);
  }

  // 댓글삭제
  // todo 댓글 삭제시 대댓글 삭제도 다 되게.
  @UseGuards(AuthGuard('jwt'))
  @Delete('/comments/:comment_id')
  async deleteComment(@Req() req, @Param('comment_id') commentId: number) {
    const criteria: DeleteCommentDto = { userId: req.user.id, id: commentId };
    const result = await this.communityService.deleteComment(criteria);
    return result;
  }

  // 댓글수정
  @UseGuards(AuthGuard('jwt'))
  @Put('/comments/:comment_id')
  async updateComment(
    @Req() req,
    @Param('comment_id') commentId: number,
    @Body() body: UpdateCommentBodyDto,
  ) {
    const toUpdateContent: string = body.content;
    const criteria: UpdateCommentDto = {
      userId: req.user.id,
      id: commentId,
    };
    return await this.communityService.updateComment(criteria, toUpdateContent);
  }

  // 댓글조회
  @UseGuards(OptionalAuthGuard)
  @Get('/posts/:post_id/comments')
  async getComments(@Req() req, @Param('post_id') postId: number) {
    const userId: number = req.user.id;
    return await this.communityService.readComments(userId, postId);
  }
  // 댓글좋아요 생성/삭제
  @UseGuards(AuthGuard('jwt'))
  @Post('/comments/:comment_id/likes')
  async createCommentLikes(@Req() req, @Param('comment_id') commentId: number) {
    const criteria: CreateCommentLikesDto = {
      userId: req.user.id,
      commentId,
    };

    const result = await this.communityService.createCommentLikes(criteria);

    return result;
  }
}
