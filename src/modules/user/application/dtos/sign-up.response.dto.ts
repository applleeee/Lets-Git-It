import { HttpStatusCode } from 'axios';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

/**
 * @author MyeongSeok
 * @description 회원가입 성공 시 응답 객체의 DTO입니다.
 */
export class SignUpCreatedDto {
  @Exclude() private readonly _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
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
}

/**
 * @author MyeongSeok
 * @description 이미 가입한 회원이 회원 가입을 시도할 때 응답 객체의 DTO입니다.
 */
export class SignUpConflictDto {
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
   * @example USER_ALREADY_EXIST
   */
  @ApiProperty({
    description: '이미 가입된 유저입니다.',
    example: 'USER_ALREADY_EXIST',
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
