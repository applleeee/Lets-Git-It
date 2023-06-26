import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateUserRequestDto {
  @IsNotEmpty()
  @IsNumber()
  readonly fieldId: number;

  @IsNotEmpty()
  @IsNumber()
  readonly careerId: number;

  @IsNotEmpty()
  @IsBoolean()
  readonly isKorean: boolean;
}
