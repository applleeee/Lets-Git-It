import { IsNumber, IsString } from 'class-validator';

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

export class AvgValuesOutput {
  @IsString()
  avgCuriosityScore: string;

  @IsString()
  avgPassionScore: string;

  @IsString()
  avgFameScore: string;

  @IsString()
  avgAbilityScore: string;

  @IsString()
  avgTotalScore: string;

  @IsString()
  avgIssueNumber: string;

  @IsString()
  avgForkingNumber: string;

  @IsString()
  avgStarringNumber: string;

  @IsString()
  avgFollowingNumber: string;

  @IsString()
  avgCommitNumber: string;

  @IsString()
  avgPRNumber: string;

  @IsString()
  avgReviewNumber: string;

  @IsString()
  avgPersonalRepoNumber: string;

  @IsString()
  avgFollowerNumber: string;

  @IsString()
  avgForkedNumber: string;

  @IsString()
  avgWatchedNumber: string;

  @IsString()
  avgSponsorNumber: string;

  @IsString()
  avgContributingRepoStarNumber: string;

  @IsString()
  avgMyStartNumber: string;
}

export class LangOutput {
  @IsString()
  main_language: string;
}

export class TotalScoresOutput {
  @IsString()
  total_score: string;
}
