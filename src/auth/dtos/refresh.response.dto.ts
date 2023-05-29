import { ApiProperty } from '@nestjs/swagger';
import { HttpStatusCode } from 'axios';
import { AuthSignUpCreatedDto } from 'src/user/application/dtos/sign-up.response.dto';

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
