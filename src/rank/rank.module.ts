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
