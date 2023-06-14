import {
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { User } from 'src/libs/decorator/user.decorator';
import { AuthorizedUser } from 'src/modules/auth/dto/auth.dto';
import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
import { DeletePostCommand } from './delete-post.command';

@Controller('/community')
export class DeletePostController {
  constructor(private readonly _commandBus: CommandBus) {}

  @UseGuards(JwtAuthGuard)
  @Delete('/posts/:postId')
  async DeletePostController(
    @Param('postId') postId: string,
    @User() user: Partial<AuthorizedUser>,
  ) {
    const { idsOfPostsCreatedByUser } = user;

    if (idsOfPostsCreatedByUser.includes(postId)) {
      const command = new DeletePostCommand({ postId });

      const result = await this._commandBus.execute(command);
      if (!result) {
        throw new HttpException(
          `COULD_NOT_FIND_A_POST_WITH_ID_${postId}`,
          HttpStatus.NOT_FOUND,
        );
      }
      return { message: 'post deleted' };
    } else {
      throw new HttpException(
        'THIS_USER_HAS_NEVER_WRITTEN_THAT_POST',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
