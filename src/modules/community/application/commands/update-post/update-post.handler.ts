import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePostCommand } from './update-post.command';
import { POST_REPOSITORY } from 'src/modules/community/community.di-tokens';
import { PostRepositoryPort } from 'src/modules/community/database/post.repository.port';
import { AwsS3Service } from 'src/modules/aws-s3/aws-s3.service';
import { PostEntity } from 'src/modules/community/domain/community.entity';

@Injectable()
@CommandHandler(UpdatePostCommand)
export class UpdatePostCommandHandler
  implements ICommandHandler<UpdatePostCommand>
{
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly _postRepository: PostRepositoryPort,
    @Inject(AwsS3Service)
    private readonly awsS3Service: AwsS3Service,
  ) {}

  async execute(command: UpdatePostCommand): Promise<void> {
    const { postId, userId, title, subCategoryId, content } = command;

    const originPost = await this._postRepository.findOneById(postId);

    try {
      await this.awsS3Service.deleteS3Data([originPost.getProps().contentUrl]);
    } catch (error) {
      throw new HttpException(
        'CANNOT_DELETE_POST_IN_S3',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

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
        'CANNOT_UPLOAD_POST_TO_S3',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    originPost.update({ title, contentUrl, subCategoryId });

    await this._postRepository.update(originPost);
  }
}
