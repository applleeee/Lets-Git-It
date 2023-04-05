import { ApiProperty } from '@nestjs/swagger';
import { Comment } from 'src/entities/Comment';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type, Exclude, Expose } from 'class-transformer';
import { Post } from 'src/entities/Post';

/**
 * @author MyeongSeok
 * @description 깃허브 엑세스 토큰을 발급 받기 위해 필요한 github code 입니다.
 */
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

/**
 * @author MyeongSeok
 * @description 회원가입 시 필요한 정보를 받는 req DTO 입니다.
 * @param githubId github user id
 * @param fieldId 유저의 개발 분야 id
 * @param careerId 유저의 개발 경력 id
 * @param isKorean 한국인 유무
 * @param userName github user name
 */
export class SignUpWithUserNameDto {
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
  readonly userName: string;
  readonly idsOfPostsCreatedByUser?: Post[];
  readonly idsOfPostLikedByUser?: number[];
  readonly idsOfCommentsCreatedByUser?: Comment[];
  readonly idsOfCommentLikedByUser?: number[];
}
