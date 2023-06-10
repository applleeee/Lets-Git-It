import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'src/libs/decorator/user.decorator';
import { AuthorizedUser } from 'src/modules/auth/dto/auth.dto';
import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
import { SaveImageToS3Command } from './save-image-to-s3.command';

@Controller('/community')
export class SaveImageToS3Controller {
  constructor(private readonly _commandBus: CommandBus) {}

  @UseGuards(JwtAuthGuard)
  @Post('/post/image')
  @UseInterceptors(FileInterceptor('image'))
  async saveImageToS3(
    @UploadedFile() image: Express.Multer.File,
    @User() user: Partial<AuthorizedUser>,
  ) {
    const { id: userId } = user;

    const command = new SaveImageToS3Command({
      userId,
      image,
    });

    return await this._commandBus.execute(command);
  }
}
