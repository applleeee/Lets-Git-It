import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RankerProfile } from 'src/entities/ranker-profile.orm-entity';
import { Ranking } from 'src/entities/ranking.orm-entity';
import { Tier } from 'src/entities/tier.orm-entity';
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
