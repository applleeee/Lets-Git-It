import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostCommand } from './create-post.command';
import { POST_REPOSITORY } from 'src/modules/community/community.di-tokens';
import { PostRepositoryPort } from 'src/modules/community/database/post.repository.port';
import { PostEntity } from 'src/modules/community/domain/post.entity';
import { AwsS3Service } from 'src/modules/aws-s3/aws-s3.service';

@Injectable()
@CommandHandler(CreatePostCommand)
export class CreatePostCommandHandler
  implements ICommandHandler<CreatePostCommand>
{
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly _postRepository: PostRepositoryPort,
    @Inject(AwsS3Service)
    private readonly awsS3Service: AwsS3Service,
  ) {}

  async execute(command: CreatePostCommand): Promise<void> {
    const { userId, title, content, subCategoryId } = command;

    const now = new Date(+new Date() + 3240 * 10000)
      .toISOString()
      .replace('T', '_')
      .replace(/\..*/, '')
      .replace(/\:/g, '-');

    const contentUrl = `post/${userId}_${title}_${now}`;
    const mimetype = 'string';

    try {
      await this.awsS3Service.uploadToS3(
        content as unknown as Buffer,
        contentUrl,
        mimetype,
      );
    } catch (error) {
      throw new HttpException(
        'CANNOT_UPLOAD_TO_S3',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const post = PostEntity.create({
      title,
      userId,
      subCategoryId,
      contentUrl,
    });

    try {
      await this._postRepository.insert(post);
    } catch (error) {
      throw new HttpException(
        'CANNOT_SAVE_POST_IN_DB',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
