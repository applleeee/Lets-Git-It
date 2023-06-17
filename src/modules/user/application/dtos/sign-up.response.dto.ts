import { HttpStatusCode } from 'axios';
import { SignInOkResDto } from './sign-in.response.dto';
import { ApiProperty, PickType } from '@nestjs/swagger';

/**
 * @author MyeongSeok
 * @description 회원가입 성공 시 응답 객체의 DTO입니다.
 */
export class AuthSignUpCreatedDto extends PickType(SignInOkResDto, [
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
