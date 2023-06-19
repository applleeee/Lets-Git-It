import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/libs/decorator/user.decorator';
import { AuthorizedUser } from 'src/modules/auth/dto/auth.dto';
import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
import { PostLikeDto } from './create-or-delete-post-like.request.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateOrDeletePostLikeCommand } from './create-or-delete-post-like.command';

@Controller('/community')
export class CreateOrDeletePostLikeController {
  constructor(private readonly _commandBus: CommandBus) {}

  @UseGuards(JwtAuthGuard)
  @Post('/like')
  async createOrDeletePostLike(
    @Body() data: PostLikeDto,
    @User() user: Partial<AuthorizedUser>,
  ) {
    const { id: userId } = user;

    const command = new CreateOrDeletePostLikeCommand({
      userId,
      data,
    });

    const result = await this._commandBus.execute(command);

    if (typeof result === 'object') {
      return { message: 'like deleted' };
    } else {
      return { message: 'like created' };
    }
  }
}
