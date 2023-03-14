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
