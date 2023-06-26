import { ApiProperty } from '@nestjs/swagger';
import { HttpStatusCode } from 'axios';
import { Exclude, Expose } from 'class-transformer';

export enum SignInResCase {
  OK = 'OK',
  UNAUTHORIZED = 'UNAUTHORIZED',
  WRONG_GITHUB_CODE = 'WRONG_GITHUB_CODE',
  WRONG_GITHUB_ACCESS_TOKEN = 'WRONG_GITHUB_ACCESS_TOKEN',
}

/**
 * @author MyeongSeok
 * @description 로그인 성공 시 응답 객체의 DTO입니다.
 * @param isMember 회원 유무
 * @param userName github user name
 * @param accessToken jwt
 */
export class SignInOkResDto {
  @Exclude() private readonly _isMember: boolean;
  @Exclude() private readonly _userName: string;
  @Exclude() private readonly _accessToken: string;
  @Exclude() private readonly _case = SignInResCase.OK;

  constructor({ isMember, userName, accessToken }) {
    this._isMember = isMember;
    this._userName = userName;
    this._accessToken = accessToken;
  }

  /**
   * 로그인 요청한 유저가 회원인지 아닌지를 나타냅니다.
   * @example true : 회원인 경우
   */
  @ApiProperty({
    example: 'true',
    description: '로그인 요청한 유저가 회원인지 아닌지를 나타냅니다.',
    required: true,
  })
  @Expose()
  get isMember(): boolean {
    return this._isMember;
  }

  /**
   * 유저의 github 이름입니다.
   * @example userName
   */
  @ApiProperty({
    example: 'userName',
    description: '유저의 github 이름입니다.',
    required: true,
  })
  @Expose()
  get userName(): string {
    return this._userName;
  }

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
  @Expose()
  get accessToken(): string {
    return this._accessToken;
  }

  @Exclude()
  get case(): string {
    return this._case;
  }
}

/**
 * @author MyeongSeok
 * @description 회원이 아닌 유저가 로그인을 시도했을 때 실패 응답 객체의 DTO입니다.
 * @param isMember 회원 유무
 * @param userName github user name
 * @param githubId github user id
 */
export class SignInUnauthorizedResDto {
  @Exclude() private readonly _isMember: boolean;
  @Exclude() private readonly _userName: string;
  @Exclude() private readonly _githubId: number;
  @Exclude() private readonly _case = SignInResCase.UNAUTHORIZED;

  constructor({ isMember, userName, githubId }) {
    this._isMember = isMember;
    this._userName = userName;
    this._githubId = githubId;
  }

  /**
   * 로그인 요청한 유저가 회원인지 아닌지를 나타냅니다.
   * @example false : 회원이 아닌 경우
   */
  @ApiProperty({
    example: 'false',
    description: '로그인 요청한 유저가 회원인지 아닌지를 나타냅니다.',
    required: true,
  })
  @Expose()
  get isMember(): boolean {
    return this._isMember;
  }

  /**
   * 유저의 github 이름입니다.
   * @example userName
   */
  @ApiProperty({
    example: 'userName',
    description: '유저의 github 이름입니다.',
    required: true,
  })
  @Expose()
  get userName(): string {
    return this._userName;
  }

  /**
   * github의 userId 입니다.
   * @example 123145
   */
  @ApiProperty({
    example: 109528794,
    description: 'github의 userId 입니다.',
    required: true,
  })
  @Expose()
  get githubId(): number {
    return this._githubId;
  }

  @Exclude()
  get case(): string {
    return this._case;
  }
}

/**
 * @author MyeongSeok
 * @description 잘못된 깃허브 코드 사용으로 인한 로그인 실패 시 응답 객체의 DTO입니다.
 */
export class SignInWrongCodeDto {
  @Exclude() private readonly _statusCode: number;
  @Exclude() private readonly _message: string;
  @Exclude() private readonly _timestamp: Date;
  @Exclude() private readonly _path: string;
  @Exclude() private readonly _case = SignInResCase.WRONG_GITHUB_CODE;

  constructor({ statusCode, message, timestamp, path }) {
    this._statusCode = statusCode;
    this._message = message;
    this._timestamp = timestamp;
    this._path = path;
  }

  /**
   * @example 400
   */
  @ApiProperty({
    example: HttpStatusCode.BadRequest,
    required: true,
  })
  @Expose()
  get statusCode(): number {
    return this._statusCode;
  }

  /**
   * 잘못된 github code입니다.
   * @example WRONG_GITHUB_CODE
   */
  @ApiProperty({
    description: '잘못된 github code입니다.',
    example: 'WRONG_GITHUB_CODE',
    required: true,
  })
  @Expose()
  get message(): string {
    return this._message;
  }

  /**
   * 요청 시간을 나타냅니다.
   * @example 2023-03-09T17:32:56.871Z
   */
  @ApiProperty({
    description: '요청 시간을 나타냅니다.',
    example: '2023-03-09T17:32:56.871Z',
    required: true,
  })
  @Expose()
  get timestamp(): Date {
    return this._timestamp;
  }

  /**
   * 요청 엔드포인트를 나타냅니다.
   * @example /auth/sign-in
   */
  @ApiProperty({
    description: '요청 엔드포인트를 나타냅니다.',
    example: '/auth/sign-in',
    required: true,
  })
  @Expose()
  get path(): string {
    return this._path;
  }

  @Exclude()
  get case(): string {
    return this._case;
  }
}

/**
 * @author MyeongSeok
 * @description github access token으로 github user 정보 조회에 실패한 경우입니다.
 */
export class SignInWrongGithubAccessTokenDto {
  @Exclude() private readonly _statusCode: number;
  @Exclude() private readonly _message: string;
  @Exclude() private readonly _timestamp: Date;
  @Exclude() private readonly _path: string;
  @Exclude() private readonly _case = SignInResCase.WRONG_GITHUB_ACCESS_TOKEN;

  constructor({ statusCode, message, timestamp, path }) {
    this._statusCode = statusCode;
    this._message = message;
    this._timestamp = timestamp;
    this._path = path;
  }

  /**
   * @example 404
   */
  @ApiProperty({
    example: HttpStatusCode.NotFound,
    required: true,
  })
  @Expose()
  get statusCode(): number {
    return this._statusCode;
  }

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
  @Expose()
  get message(): string {
    return this._message;
  }

  /**
   * 요청 시간을 나타냅니다.
   * @example 2023-03-09T17:32:56.871Z
   */
  @ApiProperty({
    description: '요청 시간을 나타냅니다.',
    example: '2023-03-09T17:32:56.871Z',
    required: true,
  })
  @Expose()
  get timestamp(): Date {
    return this._timestamp;
  }

  /**
   * 요청 엔드포인트를 나타냅니다.
   * @example /auth/sign-in
   */
  @ApiProperty({
    description: '요청 엔드포인트를 나타냅니다.',
    example: '/auth/sign-in',
    required: true,
  })
  @Expose()
  get path(): string {
    return this._path;
  }

  @Exclude()
  get case(): string {
    return this._case;
  }
}
