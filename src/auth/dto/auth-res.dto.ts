import { HttpStatusCode } from 'axios';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Career } from './../../entities/Career';
import { Field } from './../../entities/Field';

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
    description: '잘못된 github code 입니다.',
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

export class AuthSignUpCreatedDto extends PickType(AuthSignInOkResDto, [
  'accessToken',
] as const) {}

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
