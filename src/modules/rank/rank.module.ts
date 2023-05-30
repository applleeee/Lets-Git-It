import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RankerProfile } from '../entities/ranker-profile.orm-entity';
import { Ranking } from '../entities/ranking.orm-entity';
import { Tier } from '../entities/tier.orm-entity';
import { RankController } from './rank.controller';
import { RankerProfileRepository } from './rankerProfile.repository';
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
  exports: [
    RankerProfileRepository,
    RankingRepository,
    TierRepository,
    RankService,
  ],
})
export class RankModule {}
