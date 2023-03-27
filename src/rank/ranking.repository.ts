import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ranking } from '../entities/Ranking';
import {
  LangOutput,
  MaxValuesOutput,
  TotalScoresOutput,
  UserRankOutput,
} from './dto/ranking.dto';
import { RankerProfileRepository } from './rankerProfile.repository';

@Injectable()
export class RankingRepository {
  constructor(
    @InjectRepository(Ranking)
    private rankingRepository: Repository<Ranking>,
    private rankerProfileRepository: RankerProfileRepository,
  ) {}

  async getAllScores(): Promise<TotalScoresOutput[]> {
    return await this.rankingRepository
      .createQueryBuilder()
      .select('total_score')
      .getRawMany();
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

  async getTop100Languages(): Promise<LangOutput[]> {
    const top100Lang: LangOutput[] = await this.rankingRepository
      .createQueryBuilder()
      .select('main_language')
      .orderBy('total_score', 'DESC')
      .limit(100)
      .getRawMany();

    return top100Lang;
  }

  async checkRanking(rankerProfileId: number): Promise<boolean> {
    return await this.rankingRepository.exist({ where: { rankerProfileId } });
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
  }

  async updateRankerTier(rankerProfileId: number, tierId: number) {
    await this.rankingRepository
      .createQueryBuilder()
      .update(Ranking)
      .set({ tierId })
      .where(`ranker_profile_id=:rankerId`, { rankerId: rankerProfileId })
      .execute();
  }

  async getAUserRanking(userName: string): Promise<UserRankOutput[]> {
    const id = await this.rankerProfileRepository.getRankerId(userName);

    const rank: UserRankOutput[] = await this.rankingRepository
      .createQueryBuilder('ranking')
      .select('RANK() OVER (ORDER BY ranking.total_score DESC)', 'rank')
      .addSelect('ranking.ranker_profile_id', 'ranker_profile_id')
      .getRawMany();

    const userRanking = rank.filter((el) => el.ranker_profile_id === id);
    return userRanking;
  }

  async getTierMaxValues(tierId: number): Promise<MaxValuesOutput> {
    const tierMaxValues: MaxValuesOutput = await this.rankingRepository
      .createQueryBuilder()
      .select([
        'MAX(ROUND(curiosity_score)) as maxCuriosityScore',
        'MAX(ROUND(passion_score)) as maxPassionScore',
        'MAX(ROUND(fame_score)) as maxFameScore',
        'MAX(ROUND(ability_score)) as maxAbilityScore',
        'MAX(ROUND(total_score)) as maxTotalScore',
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
      .where(`tier_id=:tierId`, { tierId })
      .getRawOne();

    return tierMaxValues;
  }
}
