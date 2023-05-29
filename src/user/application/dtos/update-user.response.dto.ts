import { ApiProperty } from '@nestjs/swagger';
import { HttpStatusCode } from 'axios';

export class UpdateMyPageCreatedDto {
  /**
   * 유저 정보 수정 성공 메시지입니다.
   * @example USER_INFO_UPDATED
   */
  @ApiProperty({
    description: '유저 정보 수정 성공 메시지입니다.',
    example: 'USER_INFO_UPDATED',
    required: true,
  })
  readonly message: string;
}

/**
 * @author MyeongSeok
 * @description AccessToken이 누락되었거나 기간이 만료된 경우입니다.
 */
export class UpdateMyPageUnauthorizedDto {
  /**
   * @example 401
   */
  @ApiProperty({
    example: HttpStatusCode.Unauthorized,
    required: true,
  })
  readonly statusCode: number;

  /**
   * access token이 없거나 기간이 만료된 경우입니다.
   * @example Unauthorized
   */
  @ApiProperty({
    description: 'access token이 없거나 기간이 만료되었습니다.',
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
   * @example /user
   */
  @ApiProperty({
    description: '요청 엔드포인트를 나타냅니다.',
    example: '/user',
    required: true,
  })
  readonly path: string;
}
