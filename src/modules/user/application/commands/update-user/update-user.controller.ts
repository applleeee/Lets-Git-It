import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  HttpCode,
  Patch,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { UpdateUserRequestDto } from './update-user.request.dto';
import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
import { SwaggerUpdateMyPage } from 'src/modules/swagger/user/UpdateMyPage.decorator';
import { User } from 'src/libs/decorator/user.decorator';
import { AuthorizedUser } from 'src/modules/auth/domain/auth.types';
import { UpdateUserCommand } from './update-user.command';
import { CommandBus } from '@nestjs/cqrs';

@ApiTags('User')
@Controller('user')
export class UpdateUserController {
  constructor(private readonly _commandBus: CommandBus) {}

  @SwaggerUpdateMyPage()
  @UseGuards(JwtAuthGuard)
  @Patch()
  @HttpCode(HttpStatus.CREATED)
  async updateUser(
    @User() user: Partial<AuthorizedUser>,
    @Body() body: UpdateUserRequestDto,
  ) {
    return await this._commandBus.execute(
      new UpdateUserCommand({ id: user.id, ...body }),
    );
  }
}
