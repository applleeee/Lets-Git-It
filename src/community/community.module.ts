import { JwtModule, JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityController } from './community.controller';
import { CommunityRepository } from './community.repository';
import { CommunityService } from './community.service';
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
import { jwtConstants } from '../auth/constants';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { RankerProfileRepository } from '../rank/rankerProfile.repository';
import { RankService } from '../rank/rank.service';
import { RankModule } from '../rank/rank.module';
import { RankingRepository } from '../rank/ranking.repository';
import { TierRepository } from '../rank/tier.repository';

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
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  controllers: [CommunityController],
  providers: [
    CommunityService,
    CommunityRepository,
    AuthService,
    JwtService,
    JwtStrategy,
    RankService,
    RankerProfileRepository,
    RankingRepository,
    TierRepository,
  ],
  exports: [CommunityRepository, CommunityService],
})
export class CommunityModule {}
