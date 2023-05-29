import { ApiProperty, PickType } from '@nestjs/swagger';
import { HttpStatusCode } from 'axios';

/**
 * @author MyeongSeok
 * @description 로그인 성공 시 응답 객체의 DTO입니다.
 * @param isMember 회원 유무
 * @param userName github user name
 * @param accessToken jwt
 */
export class AuthSignInOkResDto {
  /**
   * 로그인 요청한 유저가 회원인지 아닌지를 나타냅니다.
   * @example true : 회원인 경우
   */
  @ApiProperty({
    example: 'true',
    description: '로그인 요청한 유저가 회원인지 아닌지를 나타냅니다.',
    required: true,
  })
  readonly isMember: boolean;

  /**
   * 유저의 github 이름입니다.
   * @example userName
   */
  @ApiProperty({
    example: 'userName',
    description: '유저의 github 이름입니다.',
    required: true,
  })
  readonly userName: string;

  /**
   * 인가(Authorization)에 필요한 jwtToken 입니다. 인가가 필요한 요청 시 헤더(Authorization)에 담아주세요.
   * @example jwtToken
   */
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMwLCJzZWNyZXRPclByaXZhdGVLZXkiOiJnaXRfcmFuayIsImlhdCI6MTY3NjU1MjU2MywiZXhwIjoxNjc2NTU0MzYzfQ.VE8cC20AziLwXYcruiwedYda8LaX4k43nRZQLBmG0tA',
    description:
      '인가(Authorization)에 필요한 jwtToken 입니다. 인가가 필요한 요청 시 헤더(Authorization)에 담아주세요.',
    required: true,
  })
  readonly accessToken: string;
}

/**
 * @author MyeongSeok
 * @description 회원이 아닌 유저가 로그인을 시도했을 때 실패 응답 객체의 DTO입니다.
 * @param isMember 회원 유무
 * @param userName github user name
 * @param githubId github user id
 */
export class AuthSignInUnauthorizedResDto extends PickType(AuthSignInOkResDto, [
  'userName',
] as const) {
  /**
   * 로그인 요청한 유저가 회원인지 아닌지를 나타냅니다.
   * @example false : 회원이 아닌 경우
   */
  @ApiProperty({
    example: 'false',
    description: '로그인 요청한 유저가 회원인지 아닌지를 나타냅니다.',
    required: true,
  })
  readonly isMember: boolean;

  /**
   * github의 userId 입니다.
   * @example 123145
   */
  @ApiProperty({
    example: 109528794,
    description: 'github의 userId 입니다.',
    required: true,
  })
  readonly githubId: number;
}

/**
 * @author MyeongSeok
 * @description 잘못된 깃허브 코드 사용으로 인한 로그인 실패 시 응답 객체의 DTO입니다.
 */
export class AuthSignInWrongCodeDto {
  /**
   * @example 400
   */
  @ApiProperty({
    example: HttpStatusCode.BadRequest,
    required: true,
  })
  readonly statusCode: number;

  /**
   * 잘못된 github code입니다.
   * @example WRONG_GITHUB_CODE
   */
  @ApiProperty({
    description: '잘못된 github code입니다.',
    example: 'WRONG_GITHUB_CODE',
    required: true,
  })
  readonly message: string;

  /**
   * 요청 시간을 나타냅니다.
   * @example 2023-03-09T17:32:56.871Z
   */
  @ApiProperty({
    description: '요청 시간을 나타냅니다.',
    example: '2023-03-09T17:32:56.871Z',
    required: true,
  })
  readonly timestamp: Date;

  /**
   * 요청 엔드포인트를 나타냅니다.
   * @example /auth/sign-in
   */
  @ApiProperty({
    description: '요청 엔드포인트를 나타냅니다.',
    example: '/auth/sign-in',
    required: true,
  })
  readonly path: string;
}

/**
 * @author MyeongSeok
 * @description github access token으로 github user 정보 조회에 실패한 경우입니다.
 */
export class AuthSignInWrongGithubAccessTokenDto {
  /**
   * @example 404
   */
  @ApiProperty({
    example: HttpStatusCode.NotFound,
    required: true,
  })
  readonly statusCode: number;

  /**
   * github access token으로 github user 정보 조회에 실패한 경우입니다.
   * @example NOT_FOUND_GITHUB_USER
   */
  @ApiProperty({
    description:
      'github access token으로 github user 정보 조회에 실패한 경우입니다.',
    example: 'NOT_FOUND_GITHUB_USER',
    required: true,
  })
  readonly message: string;

  /**
   * 요청 시간을 나타냅니다.
   * @example 2023-03-09T17:32:56.871Z
   */
  @ApiProperty({
    description: '요청 시간을 나타냅니다.',
    example: '2023-03-09T17:32:56.871Z',
    required: true,
  })
  readonly timestamp: Date;

  /**
   * 요청 엔드포인트를 나타냅니다.
   * @example /auth/sign-in
   */
  @ApiProperty({
    description: '요청 엔드포인트를 나타냅니다.',
    example: '/auth/sign-in',
    required: true,
  })
  readonly path: string;
}
