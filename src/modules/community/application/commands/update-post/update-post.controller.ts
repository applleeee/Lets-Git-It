import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { User } from 'src/libs/decorator/user.decorator';
import { AuthorizedUser } from 'src/modules/auth/dto/auth.dto';
import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
import { UpdatePostDto } from './update-post.request.dto';
import { UpdatePostCommand } from './update-post.command';

@Controller('/community')
export class UpdatePostController {
  constructor(private readonly _commandBus: CommandBus) {}

  @UseGuards(JwtAuthGuard)
  @Put('/posts/update/:postId')
  async updatePost(
    @Param('postId') postId: string,
    @Body() updatedData: UpdatePostDto,
    @User() user: Partial<AuthorizedUser>,
  ): Promise<{ message: string }> {
    const { title, subCategoryId, content } = updatedData;
    const { idsOfPostsCreatedByUser, id: userId } = user;

    if (idsOfPostsCreatedByUser.includes(postId)) {
      const command = new UpdatePostCommand({
        postId,
        userId,
        title,
        subCategoryId,
        content,
      });

      await this._commandBus.execute(command);
      return { message: 'post updated' };
    } else {
      throw new HttpException(
        'THIS_USER_HAS_NEVER_WRITTEN_THAT_POST',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
