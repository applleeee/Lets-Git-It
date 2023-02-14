import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubCategory } from '../entities/SubCategory';
import { Post } from 'src/entities/Post';
import { PostLike } from 'src/entities/PostLike';
import { Comment } from 'src/entities/Comment';
import {
  CreateCommentDto,
  CreateCommentLikesDto,
  DeleteCommentDto,
  UpdateCommentDto,
} from './dto/comment.dto';
import { CommentLike } from 'src/entities/CommentLike';

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

  async getPostToUpdate(postId: number) {
    return await this.postRepository.findOne({ where: { id: postId } });
  }

  async updatePost(
    postId: number,
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

  async deletePost(postId: number, userId: number) {}

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

  async getPostDatail(postId) {
    const postContent = await this.postRepository
      .createQueryBuilder('post')
      .select('post.content_url AS contentUrl')
      .where('post.id = :postId', { postId: postId })
      .getRawOne();
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
      .where('post.id = :postId', { postId: postId })
      .select([
        'post.id AS postId',
        'post.title',
        'post.user_id AS userId',
        'ranker_profile.name AS userName',
        'post.sub_category_id AS subCategoryId',
        'sub_category.name AS subCategoryName',
        `DATE_FORMAT(post.created_at, '%Y-%m-%d %H:%i:%s') AS createdAt`,
      ])
      .addSelect(
        `(SELECT JSON_ARRAYAGG(JSON_OBJECT("likeId", post_like.id, "userId", post_like.user_id, "createdAt", post_like.created_at))
      from post_like where post_like.id = 1) as likes`,
      )
      .getRawOne();
    postDetail.content = postContent.contentUrl;
    return postDetail;
  }

  async getPostsCreatedByUser(userId: number): Promise<Post[]> {
    return this.postRepository
      .createQueryBuilder()
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

  async getIdsOfPostLikedByUser(userId: number): Promise<Post[]> {
    return this.postLikeRepository
      .createQueryBuilder()
      .select(['post_id'])
      .where('user_id = :userId', { userId: userId })
      .getRawMany();
  }

  async createComment(commentData: CreateCommentDto) {
    const data = this.commentRepository.create(commentData);
    return await this.commentRepository.save(data);
  }

  async deleteComment(criteria: DeleteCommentDto) {
    return await this.commentRepository.delete(criteria);
  }

  async updateComment(criteria: UpdateCommentDto, toUpdateContent: string) {
    return await this.commentRepository
      .createQueryBuilder()
      .update(Comment)
      .set({
        content: toUpdateContent,
      })
      .where(`id = ${criteria.id} AND user_id = ${criteria.userId}`)
      .execute();
  }

  async isCommentExist(commentId: number) {
    return await this.commentRepository.exist({ where: { id: commentId } });
  }

  async readComments(postId: number) {
    return await this.commentRepository
      .createQueryBuilder()
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

  async readReComments(postId: number) {
    return await this.commentRepository
      .createQueryBuilder()
      .select([
        'comment.user_id as userId',
        'comment.group_order as groupOrder',
        'comment.id as reCommentId',
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

  // async readComments(postId: number) {
  //   // userName, profileImg -> rankerRepository
  //   // id, groupOrder, createdAt, updatedAt, content -> commentRepository
  //   // tier -> tearRepository
  //   // commentLikeNumber -> commentLikeRepository

  //   const comments = await this.commentRepository
  //     .createQueryBuilder()
  //     .select([
  //       'comment.user_id as userId',
  //       'comment.group_order as groupOrder',
  //       'comment.id as commentId',
  //       'ranker_profile.name as userName',
  //       'ranker_profile.profile_image_url as profileImageUrl',
  //       'comment.content as content',
  //       'tier.name as tier',
  //       'comment.depth as depth',
  //       `DATE_FORMAT(comment.created_at, '%Y-%m-%d %H:%i:%s') as createdAt`,
  //       `DATE_FORMAT(comment.updated_at, '%Y-%m-%d %H:%i:%s') as updatedAt`,
  //     ])
  //     .addSelect((subQuery) => {
  //       return subQuery
  //         .select('COUNT(comment_like.id)', 'likeNumber')
  //         .from(CommentLike, 'comment_like')
  //         .where('comment.id = comment_like.comment_id');
  //     }, 'likeNumber')
  //     // .addSelect(
  //     //   `(SELECT JSON_ARRAYAGG(JSON_OBJECT(
  //     //     'groupOrder', comment.group_order,
  //     //     'commentId',comment.id,
  //     //     'userName',ranker_profile.name,
  //     //     'profileImageUrl', ranker_profile.profile_image_url,
  //     //   'content', comment.content,
  //     //   'tier', tier.name,
  //     //   'createdAt', DATE_FORMAT(comment.created_at, '%Y-%m-%d %H:%i:%s'),
  //     //   'updatedAt', DATE_FORMAT(comment.updated_at, '%Y-%m-%d %H:%i:%s')
  //     //     )) from comment where comment.group_order = groupOrder) as reComment`,
  //     // )
  //     .leftJoin('user', 'user', 'comment.user_id = user.id')
  //     .leftJoin(
  //       'ranker_profile',
  //       'ranker_profile',
  //       'user.id = ranker_profile.user_id',
  //     )
  //     .leftJoin(
  //       'ranking',
  //       'ranking',
  //       'ranking.ranker_profile_id = ranker_profile.id',
  //     )
  //     .leftJoin('tier', 'tier', 'ranking.tier_id = tier.id')
  //     .where('comment.post_id = :postId', { postId: postId })
  //     .orderBy('comment.group_order', 'ASC')
  //     .addOrderBy('comment.created_at', 'ASC')
  //     // .groupBy('comment.group_order')
  //     // .addGroupBy('comment.id')
  //     // .addGroupBy('user.id')
  //     // .addGroupBy('ranker_profile.profile_image_url')
  //     // .addGroupBy('comment.content')
  //     // .addGroupBy('tier.name')
  //     // .addGroupBy('comment.created_at')
  //     // .addGroupBy('comment.updated_at')
  //     .getRawMany();

  //   return comments;
  //   // comments.map((comment, i) => {
  //   //   comment[i].groupOrder;
  //   // });

  //   // return await this.commentRepository.find({
  //   //   where: { postId: postId },
  //   //   order: { groupOrder: 'asc', createdAt: 'asc' },
  //   // });
  // }

  async createCommentLikes(criteria: CreateCommentLikesDto) {
    const isExist = await this.commentLikeRepository.exist({
      where: { userId: criteria.userId, commentId: criteria.commentId },
    });

    if (!isExist) return await this.commentLikeRepository.save(criteria);

    return await this.commentLikeRepository.delete(criteria);
  }

  async getCommentsCreatedByUser(userId: number): Promise<Comment[]> {
    return this.commentRepository
      .createQueryBuilder()
      .select(['id', 'content', 'post_id as postId', 'created_at as createdAt'])
      .where('user_id = :userId', { userId: userId })
      .getRawMany();
  }

  async getIdsOfCommentLikedByUser(userId: number): Promise<CommentLike[]> {
    return this.commentLikeRepository
      .createQueryBuilder()
      .select(['comment_id'])
      .where('user_id = :userId', { userId: userId })
      .getRawMany();
  }
}
