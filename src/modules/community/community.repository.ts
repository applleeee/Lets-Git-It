import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubCategory } from '../entities/SubCategory';
import { Post } from '../entities/Post';
import { PostLike } from '../entities/PostLike';
import { Comment } from '../entities/Comment';
import {
  CreateCommentDto,
  CreateOrDeleteCommentLikesDto,
  DeleteCommentDto,
  UpdateCommentDto,
} from './dto/comment.dto';
import { CommentLike } from '../entities/CommentLike';
import { DateEnum, SortEnum } from './dto/Post.dto';

@Injectable()
export class CommunityRepository {
  constructor(
    @InjectRepository(SubCategory)
    private subCategoryRepository: Repository<SubCategory>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(PostLike)
    private postLikeRepository: Repository<PostLike>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(CommentLike)
    private commentLikeRepository: Repository<CommentLike>,
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

  async getAllCategories() {
    return await this.subCategoryRepository.find();
  }

  async createPost(
    title: string,
    userId: string,
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

  async getPostById(postId: string) {
    return await this.postRepository.findOne({ where: { id: postId } });
  }

  async updatePost(
    postId: string,
    title: string,
    subCategoryId: number,
    contentUrl: string,
  ) {
    return await this.postRepository
      .createQueryBuilder()
      .update(Post)
      .set({
        title: title,
        contentUrl: contentUrl,
        subCategoryId: subCategoryId,
      })
      .where('id = :id', { id: postId })
      .execute();
  }

  async deletePost(postId: string) {
    return await this.postRepository.delete({ id: postId });
  }

  async getPostList(
    subCategoryId: number,
    sort: SortEnum,
    date: DateEnum | undefined,
    offset: number,
    limit: number,
  ) {
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
    const data = await queryBuilderForData.getRawMany();
    return { fixed: fixed, postLists: data, total: total };
  }

  async getPostDetail(postId: number) {
    const postDetail = await this.postRepository
      .createQueryBuilder('post')
      .leftJoin('user', 'user', 'user.id = post.user_id')
      .leftJoin(
        'ranker_profile',
        'ranker_profile',
        'ranker_profile.user_id = user.id',
      )
      .leftJoin(
        'sub_category',
        'sub_category',
        'post.sub_category_id = sub_category.id',
      )
      .leftJoin('post_like', 'post_like', 'post_like.post_id = post.id')
      .leftJoin(
        'ranking',
        'ranking',
        'ranking.ranker_profile_id = ranker_profile.id',
      )
      .leftJoin('tier', 'tier', 'tier.id = ranking.tier_id')
      .select([
        'post.title AS postTitle',
        'post.id AS postId',
        'post.user_id AS userId',
        'post.content_url AS content',
        'ranker_profile.name AS userName',
        'ranker_profile.profile_image_url AS userProfileImage',
        'tier.id AS tierId',
        'tier.name AS tierName',
        'post.sub_category_id AS subCategoryId',
        'sub_category.name AS subCategoryName',
        "DATE_FORMAT(post.created_at, '%Y-%m-%d %H:%i:%s') AS createdAt",
      ])
      .addSelect(
        `(SELECT JSON_ARRAYAGG(JSON_OBJECT("likeId", post_like.id, "userId", post_like.user_id, "createdAt", post_like.created_at))
      from post_like where post_like.post_id = post.id) as likes`,
      )
      .where('post.id = :id', { id: postId })
      .getRawOne();

    return postDetail;
  }

  async createOrDeletePostLike(postId: string, userId: string) {
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
        console.log('createOrDeletePostLike db error: ', err);
        throw new HttpException(
          'Error: invaild postId',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else if (ifLiked) {
      return await this.postLikeRepository.delete({ id: ifLiked.id });
    }
  }

  async searchPost(
    option: string,
    keyword: string,
    offset: number,
    limit: number,
  ) {
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

  async getPostsCreatedByUser(userId: string): Promise<Post[]> {
    return this.postRepository
      .createQueryBuilder('post')
      .select([
        'post.id as id',
        'post.title as title',
        'sub_category.name as subCategory',
        `DATE_FORMAT(post.created_at, '%Y-%m-%d %H:%i:%s') as createdAt`,
      ])
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(post_like.id)', 'likeNumber')
          .from(PostLike, 'post_like')
          .where('post_like.post_id = post.id');
      }, 'likeNumber')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(comment.post_id)', 'commentNumber')
          .from(Comment, 'comment')
          .where('post.id = comment.post_id');
      }, 'commentNumber')
      .leftJoin(
        'sub_category',
        'sub_category',
        'sub_category.id = post.sub_category_id',
      )
      .where('post.user_id = :userId', { userId: userId })
      .groupBy('post.id')
      .getRawMany();
  }

  async getIdsOfPostLikedByUser(userId: string): Promise<Post[]> {
    return this.postLikeRepository
      .createQueryBuilder('post')
      .select(['post_id'])
      .where('user_id = :userId', { userId: userId })
      .getRawMany();
  }

  async createComment(commentData: CreateCommentDto) {
    const data = this.commentRepository.create(commentData);
    return await this.commentRepository.save(data);
  }

  async deleteComment(criteria) {
    return await this.commentRepository.delete(criteria);
  }

  async deleteReComment(criteria: DeleteCommentDto) {
    return await this.commentRepository.delete(criteria);
  }

  async updateComment(criteria: UpdateCommentDto, content: string) {
    return await this.commentRepository
      .createQueryBuilder()
      .update(Comment)
      .set({
        content: content,
      })
      .where(`id = ${criteria.id} AND user_id = ${criteria.user.id}`)
      .execute();
  }

  async isCommentExist(commentId: string) {
    return await this.commentRepository.exist({ where: { id: commentId } });
  }

  async getComments(postId: string) {
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
          .from(CommentLike, 'comment_like')
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
  async getReComments(postId: string) {
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
          .from(CommentLike, 'comment_like')
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

  async createOrDeleteCommentLikes(criteria: CreateOrDeleteCommentLikesDto) {
    const isExist = await this.commentLikeRepository.exist({
      where: { ...criteria },
    });

    if (!isExist) return await this.commentLikeRepository.save(criteria);

    return await this.commentLikeRepository.delete(criteria);
  }

  async getCommentsCreatedByUser(userId: string): Promise<Comment[]> {
    return this.commentRepository
      .createQueryBuilder('comment')
      .select(['id', 'content', 'post_id as postId', 'created_at as createdAt'])
      .where('user_id = :userId', { userId: userId })
      .getRawMany();
  }

  async getIdsOfCommentLikedByUser(userId: string): Promise<CommentLike[]> {
    return this.commentLikeRepository
      .createQueryBuilder('comment')
      .select(['comment_id'])
      .where('user_id = :userId', { userId: userId })
      .getRawMany();
  }
}
