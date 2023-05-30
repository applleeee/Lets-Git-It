import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * @author MyeongSeok
 * @description 깃허브 엑세스 토큰을 발급 받기 위해 필요한 github code 입니다.
 */
export class SignInRequestDto {
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
