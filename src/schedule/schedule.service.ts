import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RankerProfileRepository } from 'src/rank/rankerProfile.repository';
import { RankingRepository } from 'src/rank/ranking.repository';
import { TierRepository } from 'src/rank/tier.repository';

@Injectable()
export class SchedulerService {
  constructor(
    private rankerProfileRepository: RankerProfileRepository,
    private rankingRepository: RankingRepository,
    private tierRepository: TierRepository,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async letsTrying() {
    const top100 = await this.rankerProfileRepository.getTop100(`IS NOT NULL`);
    const tierData = await this.tierRepository.getTierData();
    const scores = await this.rankingRepository.getAllScores();

    const ranking = scores
      .map((el) => parseFloat(el.total_score))
      .sort((a, b) => b - a);

    top100.forEach((el) => {
      const newPercentile =
        ((ranking.indexOf(parseFloat(el.totalScore)) + 1) / ranking.length) *
        100;

      let tierId = 0;
      for (const t of tierData) {
        if (
          newPercentile > parseFloat(t.endPercent) &&
          newPercentile <= parseFloat(t.startPercent)
        ) {
          tierId = t.id;
        }
      }
      this.rankingRepository.updateRankerTier(el.rankerProfileId, tierId);
    });
    console.log('티어 갱신');
  }
}
