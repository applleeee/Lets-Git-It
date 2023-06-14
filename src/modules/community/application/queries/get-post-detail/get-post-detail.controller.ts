import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { User } from 'src/libs/decorator/user.decorator';
import { AuthorizedUser } from 'src/modules/auth/dto/auth.dto';
import { OptionalAuthGuard } from 'src/modules/auth/guard/jwt-auth-optional.guard';
import { GetPostDetailQuery } from './get-post-detail.query';
import { GetPostDetailResponseDto } from '../../res-dto/get-post-detail.response.dto';

@Controller('/community')
export class GetPostDetailController {
  constructor(private readonly queryBus: QueryBus) {}

  @UseGuards(OptionalAuthGuard)
  @Get('/posts/:postId')
  async getPostDetail(
    @Param('postId') postId: string,
    @User() user: Partial<AuthorizedUser>,
  ): Promise<GetPostDetailResponseDto> {
    const query = new GetPostDetailQuery({ postId });

    const result = await this.queryBus.execute(query);

    if (user) {
      const { idsOfPostLikedByUser, idsOfPostsCreatedByUser } = user;
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
    if (!user) {
      result.isLogin = false;
      return result;
    }
  }
}
