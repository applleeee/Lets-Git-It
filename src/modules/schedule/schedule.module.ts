import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RankerProfileRepository } from 'src/modules/rank/rankerProfile.repository';
import { RankingRepository } from 'src/modules/rank/ranking.repository';
import { TierRepository } from 'src/modules/rank/tier.repository';
import { SchedulerService } from './schedule.service';
import { RankerProfile } from '../entities/ranker-profile.orm-entity';
import { Ranking } from '../entities/ranking.orm-entity';
import { Tier } from '../entities/tier.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RankerProfile, Ranking, Tier]),
    ScheduleModule.forRoot(),
  ],
  providers: [
    SchedulerService,
    RankerProfileRepository,
    RankingRepository,
    TierRepository,
  ],
})
export class SchedulerModule {}
