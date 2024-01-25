import { IsNumber, IsString } from 'class-validator';

export class LangOutput {
  @IsString()
  main_language: string;
}

export class TotalScoresOutput {
  @IsString()
  total_score: string;
}

export class UserRankOutput {
  @IsString()
  rank: string;

  @IsNumber()
  ranker_profile_id: number;
}

export class MaxValuesOutput {
  @IsString()
  maxCuriosityScore: string;

  @IsString()
  maxPassionScore: string;

  @IsString()
  maxFameScore: string;

  @IsString()
  maxAbilityScore: string;

  @IsString()
  maxTotalScore: string;

  @IsNumber()
  maxIssueNumber: number;

  @IsNumber()
  maxForkingNumber: number;

  @IsNumber()
  maxStarringNumber: number;

  @IsNumber()
  maxFollowingNumber: number;

  @IsNumber()
  maxCommitNumber: number;

  @IsNumber()
  maxPRNumber: number;

  @IsNumber()
  maxReviewNumber: number;

  @IsNumber()
  maxPersonalRepoNumber: number;

  @IsNumber()
  maxFollowerNumber: number;

  @IsNumber()
  maxForkedNumber: number;

  @IsNumber()
  maxWatchedNumber: number;

  @IsNumber()
  maxSponsorNumber: number;

  @IsNumber()
  maxContributingRepoStarNumber: number;

  @IsNumber()
  maxMyStartNumber: number;
}
