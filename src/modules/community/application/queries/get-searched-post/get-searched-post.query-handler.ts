import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSearchedPostQuery } from './get-searched-post.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/modules/entities/Post';
import { Repository } from 'typeorm';

@QueryHandler(GetSearchedPostQuery)
export class GetSearchedPostQueryHandler implements IQueryHandler {
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

  async execute(query: GetSearchedPostQuery) {
    const { option, keyword, offset, limit } = query.queryParams;

    const queryBuilder = this.postList(offset, limit);

    if (option === 'title') {
      queryBuilder.where('post.title LIKE :keyword', {
        keyword: `%${keyword}%`,
      });
    } else if (option === 'author') {
      queryBuilder.where('ranker_profile.name LIKE :keyword', {
        keyword: `%${keyword}%`,
      });
    } else if (option === 'title_author') {
      queryBuilder
        .where('post.title LIKE :keyword', {
          keyword: `%${keyword}%`,
        })
        .orWhere('ranker_profile.name LIKE :keyword', {
          keyword: `%${keyword}%`,
        });
    }

    const data = await queryBuilder.getRawMany();
    const total = await queryBuilder.getCount();

    return { postLists: data, total: total };
  }
}
