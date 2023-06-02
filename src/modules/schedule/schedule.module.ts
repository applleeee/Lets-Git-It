import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RankerProfile } from 'src/modules/entities/RankerProfile';
import { Ranking } from 'src/modules/entities/Ranking';
import { Tier } from 'src/modules/entities/Tier';
import { RankerProfileRepository } from 'src/modules/rank/rankerProfile.repository';
import { RankingRepository } from 'src/modules/rank/ranking.repository';
import { TierRepository } from 'src/modules/rank/tier.repository';
import { SchedulerService } from './schedule.service';

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
