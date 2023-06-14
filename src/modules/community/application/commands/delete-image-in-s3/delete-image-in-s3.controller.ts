import { Body, Controller, Delete, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
import { DeleteImageInS3RequestDto } from './delete-image-in-s3.request.dto';
import { DeleteImageInS3Command } from './delete-image-in-s3.command';
import { DeleteObjectsCommandOutput } from '@aws-sdk/client-s3';

@Controller('/community')
export class DeleteImageInS3Controller {
  constructor(private readonly _commandBus: CommandBus) {}

  @UseGuards(JwtAuthGuard)
  @Delete('/post/image')
  async deleteImageInS3(
    @Body() toDeleteImageData: DeleteImageInS3RequestDto,
  ): Promise<DeleteObjectsCommandOutput | { message: string }> {
    const { toDeleteImage } = toDeleteImageData;

    const command = new DeleteImageInS3Command({
      toDeleteImage,
    });

    return await this._commandBus.execute(command);
  }
}
