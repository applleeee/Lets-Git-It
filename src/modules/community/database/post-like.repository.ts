import { Injectable } from '@nestjs/common';
import { MySqlRepositoryBase } from 'src/libs/db/mysql-respository.base';
import { PostLike as PostLikeOrmEntity } from 'src/modules/entities/PostLike';
import { PostLikeRepositoryPort } from './post-like.repository.port';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostLikeMapper } from '../mapper/postLike.mapper';
import { PostLikeEntity } from '../domain/postLike.entity';

@Injectable()
export class PostLikeRepository
  extends MySqlRepositoryBase<PostLikeEntity, PostLikeOrmEntity>
  implements PostLikeRepositoryPort
{
  protected tableName: string;

  constructor(
    @InjectRepository(PostLikeOrmEntity)
    private readonly postLikeRepository: Repository<PostLikeOrmEntity>,
    mapper: PostLikeMapper,
  ) {
    super(mapper, postLikeRepository);
  }

  async findWithUserAndPostId(postId: string, userId: string) {
    return await this.postLikeRepository.findOne({
      where: { postId, userId },
    });
  }
}
