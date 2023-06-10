import { IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
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

  id?: string;
}
