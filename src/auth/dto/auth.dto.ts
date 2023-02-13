import { Comment } from 'src/entities/Comment';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { Post } from 'src/entities/Post';

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

export class AuthorizedUser {
  readonly id: number;
  readonly idsOfPostsCreatedByUser?: Post[];
  readonly idsOfPostLikedByUser?: number[];
  readonly idsOfCommentsCreatedByUser?: Comment[];
  readonly idsOfCommentLikedByUser?: number[];
}
