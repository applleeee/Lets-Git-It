import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RankerProfile } from '../entities/RankerProfile';
import { Ranking } from '../entities/Ranking';
import { Tier } from '../entities/Tier';
import { RankController } from './rank.controller';
import { RankerProfileRepository } from './rank_profile.repository';
import { RankService } from './rank.service';
import { RankingRepository } from './ranking.repository';
import { TierRepository } from './tier.repository';
import { User } from 'src/entities/User';
import { Comment } from 'src/entities/Comment';
import { CommentLike } from 'src/entities/CommentLike';
import { Post } from 'src/entities/Post';
import { PostLike } from 'src/entities/PostLike';
import { Field } from 'src/entities/Field';
import { Career } from 'src/entities/Career';

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
})
export class RankModule {}
