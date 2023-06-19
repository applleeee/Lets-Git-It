import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeletePostCommand } from './delete-post.command';
import { POST_REPOSITORY } from 'src/modules/community/community.di-tokens';
import { PostRepositoryPort } from 'src/modules/community/database/post.repository.port';
import { AwsS3Service } from 'src/modules/aws-s3/aws-s3.service';
import { PostEntity } from 'src/modules/community/domain/post.entity';

@Injectable()
@CommandHandler(DeletePostCommand)
export class DeletePostCommandHandler
  implements ICommandHandler<DeletePostCommand>
{
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly _postRepository: PostRepositoryPort,
    @Inject(AwsS3Service)
    private readonly awsS3Service: AwsS3Service,
  ) {}

  async execute(command: DeletePostCommand): Promise<PostEntity> {
    const { postId } = command;

    const originPost = await this._postRepository.findOneById(postId);

    try {
      await this.awsS3Service.deleteS3Data([originPost.getProps().contentUrl]);
    } catch (error) {
      throw new HttpException(
        'CANNOT_DELETE_POST_IN_S3',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return await this._postRepository.delete(originPost);
  }
}
