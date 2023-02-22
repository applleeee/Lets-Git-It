import { CommunityRepository } from './../community/community.repository';
import { MainCategory } from '../entities/MainCategory';
import { SubCategory } from '../entities/SubCategory';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../entities/User';
import { Field } from '../entities/Field';
import { Career } from '../entities/Career';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthRepository } from './auth.repository';
import { RankModule } from '../rank/rank.module';
import { Post } from '../entities/Post';
import { PostLike } from '../entities/PostLike';
import { CommentLike } from '../entities/CommentLike';
import { RankerProfile } from '../entities/RankerProfile';
import { Ranking } from '../entities/Ranking';
import { Tier } from '../entities/Tier';
import { Comment } from '../entities/Comment';
import { CommunityService } from '../community/community.service';
import { RankService } from '../rank/rank.service';
import { RankingRepository } from '../rank/ranking.repository';
import { TierRepository } from '../rank/tier.repository';
import { UserRepository } from '../user/user.repository';
import { RankerProfileRepository } from '../rank/rankerProfile.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Field,
      Career,
      SubCategory,
      MainCategory,
      Post,
      PostLike,
      Comment,
      CommentLike,
      RankerProfile,
      Ranking,
      Tier,
    ]),
    HttpModule,
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
    RankModule,
    RankerProfile,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    JwtStrategy,
    AuthRepository,
    CommunityRepository,
    CommunityService,
    RankService,
    RankingRepository,
    TierRepository,
    UserRepository,
    RankerProfileRepository,
  ],
  exports: [AuthService, AuthRepository],
})
export class AuthModule {}
