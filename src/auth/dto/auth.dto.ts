import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
export class GithubCodeDto {
  @IsString({ message: 'BAD_GITHUB_CODE' })
  readonly code: string;
}

export class SignUpDto {
  @Type(() => Number)
  @IsNumber()
  readonly githubId: number;

  @Type(() => Number)
  @IsNumber()
  readonly fieldId: number;

  @Type(() => Number)
  @IsNumber()
  readonly careerId: number;

  @Type(() => Boolean)
  @IsBoolean()
  readonly isKorean: boolean;
}
