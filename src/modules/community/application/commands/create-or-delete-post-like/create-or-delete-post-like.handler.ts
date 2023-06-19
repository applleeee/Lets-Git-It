import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrDeletePostLikeCommand } from './create-or-delete-post-like.command';
import { POST_LIKE_REPOSITORY } from 'src/modules/community/community.di-tokens';
import { PostLikeRepositoryPort } from 'src/modules/community/database/post-like.respository.port';
import { PostLikeEntity } from 'src/modules/community/domain/postLike.entity';
import { PostLikeMapper } from 'src/modules/community/mapper/postLike.mapper';

@Injectable()
@CommandHandler(CreateOrDeletePostLikeCommand)
export class CreateOrDeletePostLikeCommandHandler
  implements ICommandHandler<CreateOrDeletePostLikeCommand>
{
  constructor(
    @Inject(POST_LIKE_REPOSITORY)
    private readonly _postLikeRepository: PostLikeRepositoryPort,
    private readonly mapper: PostLikeMapper,
  ) {}

  async execute(command: CreateOrDeletePostLikeCommand): Promise<any> {
    const {
      userId,
      data: { postId },
    } = command;

    const ifLiked = await this._postLikeRepository.findWithUserAndPostId(
      postId,
      userId,
    );

    if (!ifLiked) {
      try {
        const createPostLikeProps = { postId, userId };

        const postLike = PostLikeEntity.create(createPostLikeProps);
        return await this._postLikeRepository.insert(postLike);
      } catch (error) {
        throw new HttpException(
          'CANNOT_SAVE_POSTLIKE_IN_DB',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else if (ifLiked) {
      try {
        const postLikeEntity = this.mapper.toDomain(ifLiked);
        return await this._postLikeRepository.delete(postLikeEntity);
      } catch (error) {
        throw new HttpException(
          'CANNOT_DELETE_POST_LIKE_IN_DB',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
