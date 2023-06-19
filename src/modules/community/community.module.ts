import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategory } from '../entities/SubCategory';
import { MainCategory } from '../entities/MainCategory';
import { Post } from '../entities/Post';
import { User } from '../entities/User';
import { PostLike } from '../entities/PostLike';
import { Comment } from '../entities/Comment';
import { RankerProfile } from '../entities/RankerProfile';
import { Ranking } from '../entities/Ranking';
import { Tier } from '../entities/Tier';
import { CommentLike } from '../entities/CommentLike';
import { AuthModule } from '../../modules/auth/auth.module';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from '../../modules/auth/strategy/jwt.strategy';
import { RankerProfileRepository } from '../rank/rankerProfile.repository';
import { RankService } from '../rank/rank.service';
import { RankModule } from '../rank/rank.module';
import { RankingRepository } from '../rank/ranking.repository';
import { TierRepository } from '../rank/tier.repository';
import { GetAllPostCategoriesController } from './application/queries/get-all-post-categories/get-all-post-categories.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { GetAllCategoriesQueryHandler } from './application/queries/get-all-post-categories/get-all-post-categories.query-handler';
import { CreatePostController } from './application/commands/create-post/create-post.controller';
import { SaveImageToS3Controller } from './application/commands/save-image-to-s3/save-image-to-s3.controller';
import { AwsS3Module } from '../aws-s3/aws-s3.module';
import { CreatePostCommandHandler } from './application/commands/create-post/create-post.handler';
import { POST_LIKE_REPOSITORY, POST_REPOSITORY } from './community.di-tokens';
import { PostRepository } from './database/post.repository';
import { CommunityService } from './application/community.service';
import { CommunityRepository } from './community.repository';
import { PostMapper } from './mapper/post.mapper';
import { SaveImageToS3CommandHandler } from './application/commands/save-image-to-s3/save-image-to-s3.handler';
import { DeleteImageInS3Controller } from './application/commands/delete-image-in-s3/delete-image-in-s3.controller';
import { DeleteImageInS3CommandHandler } from './application/commands/delete-image-in-s3/delete-image-in-s3.handler';
import { UpdatePostController } from './application/commands/update-post/update-post.controller';
import { UpdatePostCommandHandler } from './application/commands/update-post/update-post.handler';
import { DeletePostController } from './application/commands/delete-post/delete-post.controller';
import { DeletePostCommandHandler } from './application/commands/delete-post/delete-post.handler';
import { GetPostDetailController } from './application/queries/get-post-detail/get-post-detail.controller';
import { GetPostDetailQueryHandler } from './application/queries/get-post-detail/get-post-detail.query-handler';
import { GetPostListController } from './application/queries/get-post-list/get-post-list.controller';
import { GetPostListQueryHandler } from './application/queries/get-post-list/get-post-list.query-handler';
import { CreateOrDeletePostLikeController } from './application/commands/create-or-delete-post-like/create-or-delete-post-like.controller';
import { CreateOrDeletePostLikeCommandHandler } from './application/commands/create-or-delete-post-like/create-or-delete-post-like.handler';
import { PostLikeRepository } from './database/post-like.respository';
import { PostLikeMapper } from './mapper/postLike.mapper';

const controllers = [
  GetAllPostCategoriesController,
  CreatePostController,
  SaveImageToS3Controller,
  DeleteImageInS3Controller,
  UpdatePostController,
  DeletePostController,
  GetPostDetailController,
  GetPostListController,
  CreateOrDeletePostLikeController,
];

const commandHandlers = [
  CreatePostCommandHandler,
  SaveImageToS3CommandHandler,
  DeleteImageInS3CommandHandler,
  UpdatePostCommandHandler,
  DeletePostCommandHandler,
  CreateOrDeletePostLikeCommandHandler,
];

const queryHandlers = [
  GetAllCategoriesQueryHandler,
  GetPostDetailQueryHandler,
  GetPostListQueryHandler,
];

const repositories = [
  { provide: POST_REPOSITORY, useClass: PostRepository },
  { provide: POST_LIKE_REPOSITORY, useClass: PostLikeRepository },
];

const mappers = [PostMapper, PostLikeMapper];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SubCategory,
      MainCategory,
      Post,
      User,
      PostLike,
      Comment,
      CommentLike,
      RankerProfile,
      Ranking,
      Tier,
    ]),
    AwsS3Module,
    AuthModule,
    UserModule,
    RankModule,
    CqrsModule,
  ],
  controllers: [...controllers],
  providers: [
    CommunityService,
    CommunityRepository,
    JwtStrategy,
    RankService,
    RankerProfileRepository,
    RankingRepository,
    TierRepository,
    ...commandHandlers,
    ...queryHandlers,
    ...repositories,
    ...mappers,
  ],
  exports: [CommunityService, CommunityRepository],
})
export class CommunityModule {}
