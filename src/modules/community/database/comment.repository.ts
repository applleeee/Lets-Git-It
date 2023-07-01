import { Injectable } from '@nestjs/common';
import { MySqlRepositoryBase } from 'src/libs/db/mysql-respository.base';
import { CommentEntity } from '../domain/comment.entity';
import { Comment as CommentOrmEntity } from 'src/modules/entities/Comment';
import { CommentRepositoryPort } from './comment.repository.port';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentMapper } from '../mapper/comment.mapper';
import { CommentLike as CommentLikeOrmEntity } from 'src/modules/entities/CommentLike';

@Injectable()
export class CommentRepository
  extends MySqlRepositoryBase<CommentEntity, CommentOrmEntity>
  implements CommentRepositoryPort
{
  protected tableName: string;

  constructor(
    @InjectRepository(CommentOrmEntity)
    private readonly commentRepository: Repository<CommentOrmEntity>,
    mapper: CommentMapper,
  ) {
    super(mapper, commentRepository);
  }

  async getCommentsWithPostId(postId: string) {
    return await this.commentRepository
      .createQueryBuilder('comment')
      .select([
        'comment.user_id as userId',
        'comment.group_order as groupOrder',
        'comment.id as commentId',
        'ranker_profile.name as userName',
        'ranker_profile.profile_image_url as profileImageUrl',
        'comment.content as content',
        'tier.name as tier',
        'comment.depth as depth',
        `DATE_FORMAT(comment.created_at, '%Y-%m-%d %H:%i:%s') as createdAt`,
        `DATE_FORMAT(comment.updated_at, '%Y-%m-%d %H:%i:%s') as updatedAt`,
      ])
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(comment_like.id)', 'likeNumber')
          .from(CommentLikeOrmEntity, 'comment_like')
          .where('comment.id = comment_like.comment_id');
      }, 'likeNumber')
      .leftJoin('user', 'user', 'comment.user_id = user.id')
      .leftJoin(
        'ranker_profile',
        'ranker_profile',
        'user.id = ranker_profile.user_id',
      )
      .leftJoin(
        'ranking',
        'ranking',
        'ranking.ranker_profile_id = ranker_profile.id',
      )
      .leftJoin('tier', 'tier', 'ranking.tier_id = tier.id')
      .where('comment.post_id = :postId AND comment.depth = 1', {
        postId: postId,
      })
      .orderBy('comment.group_order', 'ASC')
      .addOrderBy('comment.created_at', 'ASC')
      .getRawMany();
  }

  async getReCommentsWithPostId(postId: string) {
    return await this.commentRepository
      .createQueryBuilder('comment')
      .select([
        'comment.user_id as userId',
        'comment.group_order as groupOrder',
        'comment.id as commentId',
        'ranker_profile.name as userName',
        'ranker_profile.profile_image_url as profileImageUrl',
        'comment.content as content',
        'tier.name as tier',
        'comment.depth as depth',
        `DATE_FORMAT(comment.created_at, '%Y-%m-%d %H:%i:%s') as createdAt`,
        `DATE_FORMAT(comment.updated_at, '%Y-%m-%d %H:%i:%s') as updatedAt`,
      ])
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(comment_like.id)', 'likeNumber')
          .from(CommentLikeOrmEntity, 'comment_like')
          .where('comment.id = comment_like.comment_id');
      }, 'likeNumber')
      .leftJoin('user', 'user', 'comment.user_id = user.id')
      .leftJoin(
        'ranker_profile',
        'ranker_profile',
        'user.id = ranker_profile.user_id',
      )
      .leftJoin(
        'ranking',
        'ranking',
        'ranking.ranker_profile_id = ranker_profile.id',
      )
      .leftJoin('tier', 'tier', 'ranking.tier_id = tier.id')
      .where('comment.post_id = :postId AND comment.depth = 2', {
        postId: postId,
      })
      .orderBy('comment.group_order', 'ASC')
      .addOrderBy('comment.created_at', 'ASC')
      .getRawMany();
  }
}
