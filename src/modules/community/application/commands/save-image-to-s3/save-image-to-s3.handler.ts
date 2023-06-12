import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SaveImageToS3Command } from './save-image-to-s3.command';
import { AwsS3Service } from 'src/modules/aws-s3/aws-s3.service';

@Injectable()
@CommandHandler(SaveImageToS3Command)
export class SaveImageToS3CommandHandler
  implements ICommandHandler<SaveImageToS3Command>
{
  constructor(
    @Inject(AwsS3Service)
    private readonly awsS3Service: AwsS3Service,
  ) {}

  async execute(command: SaveImageToS3Command): Promise<string> {
    const { userId, image } = command;

    const now = new Date(+new Date() + 3240 * 10000)
      .toISOString()
      .replace('T', '_')
      .replace(/\..*/, '')
      .replace(/\:/g, '-');

    const imageName = `post_images/${userId}_${now}`;
    const mimetype = image.mimetype;

    const saveToS3 = await this.awsS3Service.uploadToS3(
      image.buffer,
      imageName,
      mimetype,
    );
    return saveToS3.Location;
  }
}
