import { IsString } from 'class-validator';

export class LangOutput {
  @IsString()
  main_language: string;
}

export class TotalScoresOutput {
  @IsString()
  total_score: string;
}
