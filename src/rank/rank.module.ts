import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RankerProfile } from './entities/ranker_profile.entity';
import { Ranking } from './entities/ranking.entity';
import { Tier } from './entities/tier.entity';
import { RankController } from './rank.controller';
import { RankerProfileRepository } from './rank_profile.repository';
import { RankService } from './rank.service';
import { RankingRepository } from './ranking.repository';
import { TierRepository } from './tier.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RankerProfile, Ranking, Tier])],
  controllers: [RankController],
  providers: [
    RankService,
    RankerProfileRepository,
    RankingRepository,
    TierRepository,
  ],
})
export class RankModule {}
