import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteImageInS3Command } from './delete-image-in-s3.command';
import { AwsS3Service } from 'src/modules/aws-s3/aws-s3.service';
import { DeleteObjectsCommandOutput } from '@aws-sdk/client-s3';

@Injectable()
@CommandHandler(DeleteImageInS3Command)
export class DeleteImageInS3CommandHandler
  implements ICommandHandler<DeleteImageInS3Command>
{
  constructor(
    @Inject(AwsS3Service)
    private readonly awsS3Service: AwsS3Service,
  ) {}

  async execute(
    command: DeleteImageInS3Command,
  ): Promise<DeleteObjectsCommandOutput | { message: string }> {
    const { toDeleteImage } = command;

    if (toDeleteImage.length !== 0) {
      return await this.awsS3Service.deleteS3Data(toDeleteImage);
    }
    return { message: 'No image to delete' };
  }
}
