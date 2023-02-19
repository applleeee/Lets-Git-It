import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ranking } from '../entities/Ranking';
import {
  AvgValuesOutput,
  LangOutput,
  MaxValuesOutput,
  TotalScoresOutput,
} from './dto/ranking.dto';

@Injectable()
export class RankingRepository {
  constructor(
    @InjectRepository(Ranking)
    private rankingRepository: Repository<Ranking>,
  ) {}

  async getAllScores(): Promise<TotalScoresOutput[]> {
    try {
      return await this.rankingRepository
        .createQueryBuilder()
        .select('total_score')
        .getRawMany();
    } catch (e) {
      throw new HttpException(
        'DATABASE SERVER CONNECTION ERROR',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async registerRanking(
    mainLanguage: string,
    curiosityScore: number,
    passionScore: number,
    fameScore: number,
    abilityScore: number,
    totalScore: number,
    issuesCount: number,
    forkingCount: number,
    starringCount: number,
    followingCount: number,
    commitsCount: number,
    pullRequestCount: number,
    reviewCount: number,
    personalRepoCount: number,
    followersCount: number,
    forkedCount: number,
    watchersCount: number,
    sponsorsCount: number,
    myStarsCount: number,
    contributingRepoStarsCount: number,
    rankerProfileId: number,
    tierId: number,
  ): Promise<void> {
    await this.rankingRepository
      .createQueryBuilder()
      .insert()
      .into(Ranking)
      .values([
        {
          mainLanguage,
          curiosityScore,
          passionScore,
          fameScore,
          abilityScore,
          totalScore,
          curiosityRaiseIssueNumber: issuesCount,
          curiosityForkRepositoryNumber: forkingCount,
          curiosityGiveStarRepositoryNumber: starringCount,
          curiosityFollowingNumber: followingCount,
          passionCommitNumber: commitsCount,
          passionPrNumber: pullRequestCount,
          passionReviewNumber: reviewCount,
          passionCreateRepositoryNumber: personalRepoCount,
          fameFollowerNumber: followersCount,
          fameRepositoryForkedNumber: forkedCount,
          fameRepositoryWatchedNumber: watchersCount,
          abilitySponseredNumber: sponsorsCount,
          abilityPublicRepositoryStarNumber: myStarsCount,
          abilityContributeRepositoryStarNumber: contributingRepoStarsCount,
          rankerProfileId,
          tierId,
        },
      ])
      .execute();
  }

  async getMaxValues(): Promise<MaxValuesOutput> {
    try {
      const maxValues: MaxValuesOutput = await this.rankingRepository
        .createQueryBuilder()
        .select([
          'MAX(curiosity_score) as maxCuriosityScore',
          'MAX(passion_score) as maxPassionScore',
          'MAX(fame_score) as maxFameScore',
          'MAX(ability_score) as maxAbilityScore',
          'MAX(total_score) as maxTotalScore',
          'MAX(curiosity_raise_issue_number) as maxIssueNumber',
          'MAX(curiosity_fork_repository_number) as maxForkingNumber',
          'MAX(curiosity_give_star_repository_number) as maxStarringNumber',
          'MAX(curiosity_following_number) as maxFollowingNumber',
          'MAX(passion_commit_number) as maxCommitNumber',
          'MAX(passion_pr_number) as maxPRNumber',
          'MAX(passion_review_number) as maxReviewNumber',
          'MAX(passion_create_repository_number) as maxPersonalRepoNumber',
          'MAX(fame_follower_number) as maxFollowerNumber',
          'MAX(fame_repository_forked_number) as maxForkedNumber',
          'MAX(fame_repository_watched_number) as maxWatchedNumber',
          'MAX(ability_sponsered_number) as maxSponsorNumber',
          'MAX(ability_contribute_repository_star_number) as maxContributingRepoStarNumber',
          'MAX(ability_public_repository_star_number) as maxMyStartNumber',
        ])
        .getRawOne();

      return maxValues;
    } catch (e) {
      throw new HttpException(
        'DATABASE SERVER CONNECTION ERROR',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async getAvgValues(): Promise<AvgValuesOutput> {
    try {
      const avgValues: AvgValuesOutput = await this.rankingRepository
        .createQueryBuilder()
        .select([
          'CEIL(AVG(curiosity_score)) as avgCuriosityScore',
          'CEIL(AVG(passion_score)) as avgPassionScore',
          'CEIL(AVG(fame_score)) as avgFameScore',
          'CEIL(AVG(ability_score)) as avgAbilityScore',
          'CEIL(AVG(total_score)) as avgTotalScore',
          'CEIL(AVG(curiosity_raise_issue_number)) as avgIssueNumber',
          'CEIL(AVG(curiosity_fork_repository_number)) as avgForkingNumber',
          'CEIL(AVG(curiosity_give_star_repository_number)) as avgStarringNumber',
          'CEIL(AVG(curiosity_following_number)) as avgFollowingNumber',
          'CEIL(AVG(passion_commit_number)) as avgCommitNumber',
          'CEIL(AVG(passion_pr_number)) as avgPRNumber',
          'CEIL(AVG(passion_review_number)) as avgReviewNumber',
          'CEIL(AVG(passion_create_repository_number)) as avgPersonalRepoNumber',
          'CEIL(AVG(fame_follower_number)) as avgFollowerNumber',
          'CEIL(AVG(fame_repository_forked_number)) as avgForkedNumber',
          'CEIL(AVG(fame_repository_watched_number)) as avgWatchedNumber',
          'CEIL(AVG(ability_sponsered_number)) as avgSponsorNumber',
          'CEIL(AVG(ability_contribute_repository_star_number)) as avgContributingRepoStarNumber',
          'CEIL(AVG(ability_public_repository_star_number)) as avgMyStartNumber',
        ])
        .getRawOne();

      return avgValues;
    } catch (e) {
      throw new HttpException(
        'DATABASE SERVER CONNECTION ERROR',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async getTop100Languages(): Promise<LangOutput[]> {
    try {
      const top100Lang: LangOutput[] = await this.rankingRepository
        .createQueryBuilder()
        .select('main_language')
        .orderBy('total_score', 'DESC')
        .limit(100)
        .getRawMany();

      return top100Lang;
    } catch (e) {
      throw new HttpException(
        'DATABASE SERVER CONNECTION ERROR',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async checkRanking(rankerProfileId: number): Promise<boolean> {
    try {
      return await this.rankingRepository.exist({ where: { rankerProfileId } });
    } catch (e) {
      throw new HttpException(
        'DATABASE SERVER CONNECTION ERROR',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async updateRanking(
    mainLanguage: string,
    curiosityScore: number,
    passionScore: number,
    fameScore: number,
    abilityScore: number,
    totalScore: number,
    issuesCount: number,
    forkingCount: number,
    starringCount: number,
    followingCount: number,
    commitsCount: number,
    pullRequestCount: number,
    reviewCount: number,
    personalRepoCount: number,
    followersCount: number,
    forkedCount: number,
    watchersCount: number,
    sponsorsCount: number,
    myStarsCount: number,
    contributingRepoStarsCount: number,
    rankerProfileId: number,
    tierId: number,
  ): Promise<void> {
    try {
      await this.rankingRepository
        .createQueryBuilder()
        .update(Ranking)
        .set({
          mainLanguage,
          curiosityScore,
          passionScore,
          fameScore,
          abilityScore,
          totalScore,
          curiosityRaiseIssueNumber: issuesCount,
          curiosityForkRepositoryNumber: forkingCount,
          curiosityGiveStarRepositoryNumber: starringCount,
          curiosityFollowingNumber: followingCount,
          passionCommitNumber: commitsCount,
          passionPrNumber: pullRequestCount,
          passionReviewNumber: reviewCount,
          passionCreateRepositoryNumber: personalRepoCount,
          fameFollowerNumber: followersCount,
          fameRepositoryForkedNumber: forkedCount,
          fameRepositoryWatchedNumber: watchersCount,
          abilitySponseredNumber: sponsorsCount,
          abilityPublicRepositoryStarNumber: myStarsCount,
          abilityContributeRepositoryStarNumber: contributingRepoStarsCount,
          tierId,
        })
        .where(`ranker_profile_id=:rankerId`, { rankerId: rankerProfileId })
        .execute();
    } catch (e) {
      throw new HttpException(
        'DATABASE SERVER CONNECTION ERROR',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
