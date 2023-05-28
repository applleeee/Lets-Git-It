import { JwtRefreshStrategy } from './../auth/strategy/jwt-refresh.strategy';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityController } from './community.controller';
import { CommunityRepository } from './community.repository';
import { CommunityService } from './application/community.service';
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
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from '../auth/strategy/jwt.strategy';
import { RankerProfileRepository } from '../rank/rankerProfile.repository';
import { RankService } from '../rank/rank.service';
import { RankModule } from '../rank/rank.module';
import { RankingRepository } from '../rank/ranking.repository';
import { TierRepository } from '../rank/tier.repository';
import { GetAllPostCategoriesController } from './application/queries/get-all-post-categories/get-all-post-categories.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { GetAllCategoriesQueryHandler } from './application/queries/get-all-post-categories/get-all-post-categories.query-handler';

const Communitycontrollers = [GetAllPostCategoriesController];

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
    AuthModule,
    UserModule,
    RankModule,
    CqrsModule,
  ],
  controllers: [...Communitycontrollers],
  providers: [
    CommunityService,
    CommunityRepository,
    JwtStrategy,
    JwtRefreshStrategy,
    RankService,
    RankerProfileRepository,
    RankingRepository,
    TierRepository,
    GetAllCategoriesQueryHandler,
  ],
  exports: [CommunityRepository, CommunityService],
})
export class CommunityModule {}
