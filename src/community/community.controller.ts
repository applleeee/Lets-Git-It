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
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommunityService } from './community.service';
import {
  CreateCommentBodyDto,
  CreateCommentDto,
  CreateOrDeleteCommentLikesDto,
  DeleteCommentDto,
  UpdateCommentBodyDto,
  UpdateCommentDto,
} from './dto/comment.dto';
import { ValidateSubCategoryIdPipe } from './pipe/getPostList.pipe';
import { OptionalAuthGuard } from './guard/optionalGuard';
import {
  GetPostListDto,
  CreatePostDto,
  SearchPostDto,
  DeleteImageDto,
  PostLikeDto,
} from './dto/Post.dto';

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
  async saveImageToS3(
    @UploadedFile() image: Express.Multer.File,
    @Req() req,
  ): Promise<string> {
    const userId: number = req.user.id;
    return await this.communityService.saveImageToS3(image, userId);
  }

  // 타입 확인(동섭님)
  @UseGuards(AuthGuard('jwt'))
  @Delete('/post/image')
  async deleteImageInS3(@Body() toDeleteImageData: DeleteImageDto) {
    return await this.communityService.deleteImageInS3(toDeleteImageData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/post')
  async createPost(@Body() postData: CreatePostDto, @Req() req) {
    const userId: number = req.user.id;
    await this.communityService.createPost(postData, userId);
    return { message: 'post created' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/posts/update/:postId')
  async getPostToUpdate(@Param('postId') postId: number, @Req() req) {
    const { idsOfPostsCreatedByUser } = req.user;
    if (idsOfPostsCreatedByUser.includes(postId)) {
      return await this.communityService.getPostToUpdate(postId);
    } else {
      throw new HttpException(
        'THIS_USER_HAS_NEVER_WRITTEN_THAT_POST',
        HttpStatus.FORBIDDEN,
      );
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
    const userId: number = req.user.id;

    if (idsOfPostsCreatedByUser.includes(postId)) {
      await this.communityService.updatePost(postId, updatedData, userId);
      return { message: 'post updated' };
    } else {
      throw new HttpException(
        'THIS_USER_HAS_NEVER_WRITTEN_THAT_POST',
        HttpStatus.FORBIDDEN,
      );
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
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/like')
  async createOrDeletePostLike(@Body() data: PostLikeDto, @Req() req) {
    const userId: number = req.user.id;
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

  @Get('/search')
  async searchPost(@Query() query: SearchPostDto) {
    return await this.communityService.searchPost(query);
  }

  // 댓글생성
  @UseGuards(AuthGuard('jwt'))
  @Post('/posts/:post_id/comment')
  @HttpCode(HttpStatus.CREATED)
  async createComment(
    @Body() body: CreateCommentBodyDto,
    @Req() req,
    @Param('post_id') postId: number,
  ) {
    const user = req.user;
    const commentData: CreateCommentDto = {
      userId: user.id,
      postId,
      ...body,
    };
    return await this.communityService.createComment(user, commentData);
  }

  // 댓글삭제
  @UseGuards(AuthGuard('jwt'))
  @Delete('/comments/:comment_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment(@Req() req, @Param('comment_id') commentId: number) {
    const criteria: DeleteCommentDto = { userId: req.user.id, id: commentId };
    return await this.communityService.deleteComment(criteria);
  }

  // 댓글수정
  @UseGuards(AuthGuard('jwt'))
  @Put('/comments/:comment_id')
  @HttpCode(HttpStatus.CREATED)
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
  @HttpCode(HttpStatus.OK)
  async getComments(@Req() req, @Param('post_id') postId: number) {
    const user = req.user;
    return await this.communityService.readComments(user, postId);
  }

  // 댓글좋아요 생성/삭제
  @UseGuards(AuthGuard('jwt'))
  @Post('/comments/:comment_id/likes')
  @HttpCode(HttpStatus.CREATED)
  async createOrDeleteCommentLikes(
    @Req() req,
    @Param('comment_id') commentId: number,
  ) {
    const criteria: CreateOrDeleteCommentLikesDto = {
      userId: req.user.id,
      commentId,
    };

    return await this.communityService.createOrDeleteCommentLikes(criteria);
  }
}
