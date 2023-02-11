import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubCategory } from '../entities/SubCategory';
import { Post } from 'src/entities/Post';
import { PostLike } from 'src/entities/PostLike';

@Injectable()
export class CommunityRepository {
  constructor(
    @InjectRepository(SubCategory)
    private subCategoryRepository: Repository<SubCategory>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(PostLike)
    private postLikeRepository: Repository<PostLike>,
  ) {}

  async getAllCategories() {
    const categories = await this.subCategoryRepository.find();
    return categories;
  }

  async createPost(
    title: string,
    userId: number,
    subCategoryId: number,
    contentUrl: string,
  ) {
    const result = await this.postRepository
      .createQueryBuilder()
      .insert()
      .into(Post)
      .values({
        title: title,
        contentUrl: contentUrl,
        userId: userId,
        subCategoryId: subCategoryId,
      })
      .execute();
    return result;
  }

  async getPostList(subCategoryId: number) {
    const result = await this.postRepository
      .createQueryBuilder()
      .select([
        'post.id as postId',
        'post.title',
        'post.view',
        'DATE_FORMAT(post.created_at, "%Y-%m-%d") AS createdAt',
        'user.id as userId',
        'ranker_profile.name AS userName',
        'COUNT(post_like.id) AS postLike',
        'COUNT(comment.id) AS comment',
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
      .where('post.subCategoryId = :subCategoryId', {
        subCategoryId: subCategoryId,
      })
      .groupBy('post.id')
      .addGroupBy('ranker_profile.name')
      .addGroupBy('tier.name')
      .addGroupBy('tier.id')
      .addGroupBy('ranker_profile.name')
      .addGroupBy('tier.name')
      .getRawMany();
    return result;
  }

  async getIdsOfPostsCreatedByUser(userId: number): Promise<Post[]> {
    return this.postRepository
      .createQueryBuilder()
      .select(['id'])
      .where('user_id = :userId', { userId: userId })
      .getRawMany();
  }

  async createOrDeletePostLike(postId, userId) {
    const ifLiked = await this.postLikeRepository.findOne({
      where: { postId: postId, userId: userId },
    });
    if (!ifLiked) {
      try {
        const postLike = new PostLike();
        postLike.postId = postId;
        postLike.userId = userId;
        return await this.postLikeRepository.save(postLike);
      } catch (err) {
        throw new HttpException(
          'Error: invaild postId',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else if (ifLiked) {
      return await this.postLikeRepository.delete({ id: ifLiked.id });
    }
  }

  async getIdsOfLikesAboutPostCreatedByUser(userId: number): Promise<Post[]> {
    return this.postLikeRepository
      .createQueryBuilder()
      .select(['post_id'])
      .where('user_id = :userId', { userId: userId })
      .getRawMany();
  }
}
