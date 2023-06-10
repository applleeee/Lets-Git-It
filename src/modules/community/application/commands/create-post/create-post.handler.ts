import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostCommand } from './create-post.command';
import { POST_REPOSITORY } from 'src/modules/community/community.di-tokens';
import { PostRepositoryPort } from 'src/modules/community/database/post.repository.port';
import { uploadToS3 } from 'src/utils/aws';
import { PostEntity } from 'src/modules/community/domain/community.entity';

@Injectable()
@CommandHandler(CreatePostCommand)
export class CreatePostCommandHandler
  implements ICommandHandler<CreatePostCommand>
{
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly _postRepository: PostRepositoryPort,
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
      await uploadToS3(content as unknown as Buffer, contentUrl, mimetype);
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
