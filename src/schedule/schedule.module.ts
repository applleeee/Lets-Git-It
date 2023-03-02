import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RankerProfile } from 'src/entities/RankerProfile';
import { Ranking } from 'src/entities/Ranking';
import { Tier } from 'src/entities/Tier';
import { RankerProfileRepository } from 'src/rank/rankerProfile.repository';
import { RankingRepository } from 'src/rank/ranking.repository';
import { TierRepository } from 'src/rank/tier.repository';
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
