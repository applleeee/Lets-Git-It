import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { User } from 'src/libs/decorator/user.decorator';
import { AuthorizedUser } from 'src/modules/auth/dto/auth.dto';
import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
import { CreateCommentRequestDto } from './create-comment.request.dto';
import { CreateCommentCommand } from './create-comment.command';

@Controller('/community')
export class CreateCommentController {
  constructor(private readonly _commandBus: CommandBus) {}

  @UseGuards(JwtAuthGuard)
  @Post('/posts/:post_id/comment')
  @HttpCode(HttpStatus.CREATED)
  async createComment(
    @Body() body: CreateCommentRequestDto,
    @User() user: Partial<AuthorizedUser>,
    @Param('post_id') postId: string,
  ) {
    const commentData = {
      userId: user.id,
      postId,
      ...body,
    };

    const command = new CreateCommentCommand({
      user,
      commentData,
    });

    return await this._commandBus.execute(command);
  }
}
