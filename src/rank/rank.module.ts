import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RankerProfile } from '../entities/RankerProfile';
import { Ranking } from '../entities/Ranking';
import { Tier } from '../entities/Tier';
import { RankController } from './rank.controller';
import { RankerProfileRepository } from './rankerProfile.repository';
import { RankService } from './rank.service';
import { RankingRepository } from './ranking.repository';
import { TierRepository } from './tier.repository';
import { User } from '../entities/User';
import { Comment } from '../entities/Comment';
import { CommentLike } from '../entities/CommentLike';
import { Post } from '../entities/Post';
import { PostLike } from '../entities/PostLike';
import { Field } from '../entities/Field';
import { Career } from '../entities/Career';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RankerProfile,
      Ranking,
      Tier,
      User,
      Comment,
      CommentLike,
      Post,
      PostLike,
      Field,
      Career,
    ]),
  ],
  controllers: [RankController],
  providers: [
    RankService,
    RankerProfileRepository,
    RankingRepository,
    TierRepository,
  ],
  exports: [RankerProfileRepository],
})
export class RankModule {}
