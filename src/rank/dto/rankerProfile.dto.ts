import { IsNumber, IsString } from 'class-validator';

export class SearchOutput {
  @IsString()
  readonly rankerName: string;

  @IsString()
  readonly profileImage?: string;

  @IsString()
  readonly tierImage?: string;
}

export class Top5 extends SearchOutput {
  @IsString()
  readonly totalScore: string;
}

export class Top100 extends Top5 {
  @IsString()
  mainLang: string;

  @IsNumber()
  followerNumber: number;

  @IsNumber()
  myStarNumber: number;

  @IsNumber()
  commitNumber: number;

  @IsString()
  totalScore: string;

  @IsString()
  tier: string;
}

export class RankerProfileOutput {
  @IsNumber()
  rankerId: number;

  @IsString()
  rankerName: string;

  @IsString()
  profileImage: string;

  @IsString()
  blog: string;

  @IsString()
  email: string;

  @IsString()
  company: string;

  @IsString()
  region: string;

  @IsString()
  mainLang: string;

  @IsString()
  curiosityScore: string;

  @IsString()
  passionScore: string;

  @IsString()
  fameScore: string;

  @IsString()
  abilityScore: string;

  @IsString()
  totalScore: string;

  @IsNumber()
  issueNumber: number;

  @IsNumber()
  forkingNumber: number;

  @IsNumber()
  starringNumber: number;

  @IsNumber()
  followingNumber: number;

  @IsNumber()
  commitNumber: number;

  @IsNumber()
  prNumber: number;

  @IsNumber()
  reviewNumber: number;

  @IsNumber()
  personalRepoNumber: number;

  @IsNumber()
  followerNumber: number;

  @IsNumber()
  forkedNumber: number;

  @IsNumber()
  watchedNumber: number;

  @IsNumber()
  sponsorNumber: number;

  @IsNumber()
  contributingRepoStarNumber: number;

  @IsNumber()
  myStarNumber: number;

  @IsString()
  tier: string;

  @IsString()
  tierImage: string;
}
