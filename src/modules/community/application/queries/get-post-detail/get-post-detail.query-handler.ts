import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/modules/entities/Post';
import { Repository } from 'typeorm';
import { GetPostDetailQuery } from './get-post-detail.query';
import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { AwsS3Service } from 'src/modules/aws-s3/aws-s3.service';

@QueryHandler(GetPostDetailQuery)
export class GetPostDetailQueryHandler implements IQueryHandler {
  constructor(
    @Inject(AwsS3Service)
    private readonly awsS3Service: AwsS3Service,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async execute(query: GetPostDetailQuery) {
    const { postId } = query;

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

    try {
      const postContent = await this.awsS3Service.getS3Data(postDetail.content);
      postDetail.content = postContent;

      return postDetail;
    } catch (error) {
      throw new HttpException(
        'CANNOT_GET_POST_FROM_S3',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
