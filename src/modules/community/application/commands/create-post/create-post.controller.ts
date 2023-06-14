import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePostRequestDto } from './create-post.request.dto';
import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
import { User } from 'src/libs/decorator/user.decorator';
import { AuthorizedUser } from 'src/modules/auth/dto/auth.dto';
import { CreatePostCommand } from './create-post.command';

@Controller('/community')
export class CreatePostController {
  constructor(private readonly _commandBus: CommandBus) {}

  @UseGuards(JwtAuthGuard)
  @Post('/post')
  async createPost(
    @Body() postData: CreatePostRequestDto,
    @User() user: Partial<AuthorizedUser>,
  ): Promise<{ message: string }> {
    const { id: userId } = user;
    const { title, subCategoryId, content } = postData;

    const command = new CreatePostCommand({
      userId,
      title,
      subCategoryId,
      content,
    });

    await this._commandBus.execute(command);
    return { message: 'post created' };
  }
}
