import { ApiProperty } from '@nestjs/swagger';
import { Comment } from 'src/entities/Comment';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type, Exclude, Expose } from 'class-transformer';
import { Post } from 'src/entities/Post';

export class GithubCodeDto {
  /**
   * github access token을 얻기 위한 github code 입니다.
   * @example asdf59607e
   */
  @ApiProperty({
    description: 'github access token을 얻기 위한 github code 입니다.',
    example: 'asdf59607e',
    required: true,
  })
  @IsString({ message: 'BAD_GITHUB_CODE' })
  readonly code: string;
}

export class SignUpDto {
  /**
   * 유저의 github userId 입니다.
   * @example 12345
   */
  @ApiProperty({
    description: '유저의 github userId 입니다.',
    example: 12345,
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  readonly githubId: number;

  /**
   * 개발분야의 id 입니다.
   * @example 1
   */
  @ApiProperty({
    description: '개발분야의 id 입니다.',
    example: 1,
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  readonly fieldId: number;

  /**
   * 개발경력의 id 입니다.
   * @example 1
   */
  @ApiProperty({
    description: '개발경력의 id 입니다.',
    example: 1,
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  readonly careerId: number;

  /**
   * 유저가 한국인인지의 여부를 boolean으로 나타냅니다.
   * @example true
   */
  @ApiProperty({
    description: '유저가 한국인인지의 여부를 boolean으로 나타냅니다.',
    example: true,
    required: true,
  })
  @Type(() => Boolean)
  @IsBoolean()
  readonly isKorean: boolean;
}

export class SignUpWithUserNameDto extends SignUpDto {
  /**
   * 유저의 github userName입니다.
   * @example userName
   */
  @ApiProperty({
    description: '유저의 github userName입니다.',
    example: 'userName',
    required: true,
  })
  @Type(() => String)
  @IsString()
  readonly userName: string;
}

export class AuthorizedUser {
  readonly id: number;
  readonly idsOfPostsCreatedByUser?: Post[];
  readonly idsOfPostLikedByUser?: number[];
  readonly idsOfCommentsCreatedByUser?: Comment[];
  readonly idsOfCommentLikedByUser?: number[];
}
