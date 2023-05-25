import { HttpStatusCode } from 'axios';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Career } from '../../../entities/Career';
import { Field } from '../../../entities/Field';

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

/**
 * @author MyeongSeok
 * @description 회원가입 성공 시 응답 객체의 DTO입니다.
 */
export class AuthSignUpCreatedDto extends PickType(AuthSignInOkResDto, [
  'accessToken',
] as const) {}

/**
 * @author MyeongSeok
 * @description 이미 가입한 회원이 회원 가입을 시도할 때 응답 객체의 DTO입니다.
 */
export class AuthSignUpConflictDto {
  /**
   * @example 409
   */
  @ApiProperty({
    example: HttpStatusCode.Conflict,
    required: true,
  })
  readonly statusCode: number;

  /**
   * 이미 가입된 유저입니다.
   * @example EXISTING_USERNAME
   */
  @ApiProperty({
    description: '이미 가입된 유저입니다.',
    example: 'EXISTING_USERNAME',
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
   * @example /auth/sign-up
   */
  @ApiProperty({
    description: '요청 엔드포인트를 나타냅니다.',
    example: '/auth/sign-up',
    required: true,
  })
  readonly path: string;
}

/**
 * @author MyeongSeok
 * @description 회원가입 시 유저에게 받아야 하는 정보의 카테고리를 반환하는 응답객체의 DTO입니다.
 */
export class AuthCategoryOkDto {
  /**
   * 유저의 개발분야를 나타냅니다.
   * @example [{ id : 1, name : 프론트엔드 }, { id : 2, name : 백엔드 }, { id : 3, name : 안드로이드 }, { id : , name : IOS }, { id : 5, name : 운영체제 }, { id : 6, name : Q/A }, { id : 7, name : 임베디드 }, { id : 8, name : 보안}, { id : 9, name : 기타 }]
   */
  @ApiProperty({
    description: '유저의 개발분야를 나타냅니다',
    example: [
      { id: 1, name: '프론트엔드' },
      { id: 2, name: '백엔드' },
      { id: 3, name: '안드로이드' },
      { id: 4, name: 'IOS' },
      { id: 5, name: '운영체제' },
      { id: 6, name: 'Q/A' },
      { id: 7, name: '임베디드' },
      { id: 8, name: '보안' },
      { id: 9, name: '기타' },
    ],
    required: true,
  })
  readonly field: Field[];

  /**
   * 유저의 개발경력을 나타냅니다.
   * @example [{ id : 1, period : 학생 }, { id : 2, period: 1년차 }, { id : 3, period : 2년차 }, { id : 4, period : 3년차}, { id : 5, period : 4년차 }, { id : 6, period  5년차 }, { id : 7, period : 6년차 }, { id : 8 ,period : 7년차 }, { id : 9, period : 8년차 }, { id : 10, period : 9년차 }, { id : 11,  period : 10년차 이상 }]
   */
  @ApiProperty({
    description: '유저의 개발경력을 나타냅니다',
    example: [
      { id: 1, period: '학생' },
      { id: 2, period: '1년차' },
      { id: 3, period: '2년차' },
      { id: 4, period: '3년차' },
      { id: 5, period: '4년차' },
      { id: 6, period: '5년차' },
      { id: 7, period: '6년차' },
      { id: 8, period: '7년차' },
      { id: 9, period: '8년차' },
      { id: 10, period: '9년차' },
      { id: 11, period: '10년차 이상' },
    ],
    required: true,
  })
  readonly career: Career[];
}

/**
 * @author MyeongSeok
 * @description 로그아웃 성공 시 응답 객체의 DTO입니다.
 */
export class SignOutOkDto {
  /**
   * 로그아웃 성공 메시지입니다.
   * @example LOG_OUT_COMPLETED
   */
  @ApiProperty({
    description: '로그아웃 성공 메시지입니다.',
    example: 'LOG_OUT_COMPLETED',
    required: true,
  })
  readonly message: string;
}

/**
 * @author MyeongSeok
 * @description 만료된 refresh token 또는 refresh token이 없이 요청한 경우의 응답 DTO입니다.
 */
export class AuthSignOutUnauthorizedDto {
  /**
   * @example 401
   */
  @ApiProperty({
    example: HttpStatusCode.Unauthorized,
    required: true,
  })
  readonly statusCode: number;

  /**
   * refresh token이 없거나 기간이 만료된 경우입니다.
   * @example Unauthorized
   */
  @ApiProperty({
    description: 'refresh token이 없거나 기간이 만료되었습니다.',
    example: 'Unauthorized',
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
   * @example /auth/sign-out
   */
  @ApiProperty({
    description: '요청 엔드포인트를 나타냅니다.',
    example: '/auth/sign-out',
    required: true,
  })
  readonly path: string;
}

/**
 * @author MyeongSeok
 * @description 엑세스 토큰 재발급 성공 시 응답 객체의 DTO입니다.
 */
export class RefreshOkDto extends AuthSignUpCreatedDto {}

/**
 * @author MyeongSeok
 * @description 만료된 refresh token 또는 refresh token이 없이 요청한 경우의 응답 DTO입니다.
 */
export class RefreshUnauthorizedDto {
  /**
   * @example 401
   */
  @ApiProperty({
    example: HttpStatusCode.Unauthorized,
    required: true,
  })
  readonly statusCode: number;

  /**
   * refresh token이 없거나 기간이 만료된 경우입니다.
   * @example Unauthorized
   */
  @ApiProperty({
    description: 'refresh token이 없거나 기간이 만료되었습니다.',
    example: 'Unauthorized',
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
   * @example /auth/refresh
   */
  @ApiProperty({
    description: '요청 엔드포인트를 나타냅니다.',
    example: '/auth/refresh',
    required: true,
  })
  readonly path: string;
}
