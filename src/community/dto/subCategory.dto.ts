import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SubCategoryOutput {
  @IsNumber()
  @IsNotEmpty()
  readonly id: number;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @IsNotEmpty()
  readonly mainCategoryId: number;
}
