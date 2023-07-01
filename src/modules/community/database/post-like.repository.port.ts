import { RepositoryPort } from 'src/libs/base/repository.port';
import { PostLike as PostLikeOrmEntity } from 'src/modules/entities/PostLike';
import { PostLikeEntity } from '../domain/postLike.entity';

export interface PostLikeRepositoryPort extends RepositoryPort<PostLikeEntity> {
  findWithUserAndPostId(
    postId: string,
    userId: string,
  ): Promise<PostLikeOrmEntity>;
}
