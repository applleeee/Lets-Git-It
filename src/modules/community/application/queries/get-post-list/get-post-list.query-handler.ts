import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPostListQuery } from './get-post-list.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/modules/entities/Post';
import { Repository } from 'typeorm';

@QueryHandler(GetPostListQuery)
export class GetPostListQueryHandler implements IQueryHandler {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  private postList(offset?: number, limit?: number) {
    return this.postRepository
      .createQueryBuilder()
      .select([
        'post.id as postId',
        'post.title',
        'post.view',
        'DATE_FORMAT(post.created_at, "%Y-%m-%d %H:%i:%s") AS createdAt',
        'user.id as userId',
        'ranker_profile.name AS userName',
        'COUNT(DISTINCT post_like.id) AS postLike',
        'COUNT(DISTINCT comment.id) AS comment',
        'tier.name AS tierName',
        'tier.id AS tierId',
        'sub_category.name AS subCategoryName',
      ])
      .from(Post, 'post')
      .leftJoin('post.user', 'user')
      .leftJoin('post.postLikes', 'post_like')
      .leftJoin('post.comments', 'comment')
      .leftJoin('user.rankerProfiles', 'ranker_profile')
      .leftJoin('ranker_profile.rankings', 'ranking')
      .leftJoin('ranking.tier', 'tier')
      .leftJoin('post.subCategory', 'sub_category')
      .groupBy('post.id')
      .addGroupBy('ranker_profile.name')
      .addGroupBy('tier.name')
      .addGroupBy('tier.id')
      .addGroupBy('ranker_profile.name')
      .addGroupBy('tier.name')
      .offset(offset)
      .limit(limit);
  }

  async execute(query: GetPostListQuery) {
    const {
      subCategoryId,
      queryParams: { sort, date, offset, limit },
    } = query;

    const queryBuilderForFixed = this.postList();
    const queryBuilderForCount = this.postList();
    const queryBuilderForData = this.postList(offset, limit);

    queryBuilderForFixed.where('post.fixedCategoryId = :subCategoryId', {
      subCategoryId: subCategoryId,
    });

    queryBuilderForCount.where('post.subCategoryId = :subCategoryId', {
      subCategoryId: subCategoryId,
    });
    queryBuilderForData.where('post.subCategoryId = :subCategoryId', {
      subCategoryId: subCategoryId,
    });

    if (sort === 'latest') {
      queryBuilderForData.orderBy('post.created_at', 'DESC');
    }

    if (sort === 'mostLiked' && date !== undefined) {
      if (date !== 'all') {
        queryBuilderForData
          .orderBy('postLike', 'DESC')
          .andWhere(
            `DATE_FORMAT(post.created_at, "%Y-%m-%d") >= DATE_SUB(NOW(), INTERVAL 1 ${date})`,
          );
        queryBuilderForCount.andWhere(
          `DATE_FORMAT(post.created_at, "%Y-%m-%d") >= DATE_SUB(NOW(), INTERVAL 1 ${date})`,
        );
      } else if (date === 'all') {
        queryBuilderForData.orderBy('postLike', 'DESC');
      }
    }

    const fixed = await queryBuilderForFixed.getRawMany();
    const total = await queryBuilderForCount.getCount();
    const postLists = await queryBuilderForData.getRawMany();

    return { fixed, postLists, total };
  }
}
