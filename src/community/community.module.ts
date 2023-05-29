import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityController } from './community.controller';
import { CommunityRepository } from './community.repository';
import { CommunityService } from './community.service';
import { SubCategory } from '../entities/sub-category.orm-entity';
import { MainCategory } from '../entities/main-category.orm-entity';
import { Post } from '../entities/post.orm-entity';
import { User } from '../user/database/user.orm-entity';
import { PostLike } from '../entities/post-like.orm-entity';
import { Comment } from '../entities/comment.orm-entity';
import { RankerProfile } from '../entities/ranker-profile.orm-entity';
import { Ranking } from '../entities/ranking.orm-entity';
import { Tier } from '../entities/tier.orm-entity';
import { CommentLike } from '../entities/comment-like.orm-entity';

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
  ],
  controllers: [CommunityController],
  providers: [CommunityService, CommunityRepository],
  exports: [CommunityRepository, CommunityService],
})
export class CommunityModule {}
