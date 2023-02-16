import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, IsNumber } from 'class-validator';

export enum OptionEnum {
  title = 'title',
  author = 'author',
  title_author = 'title_author',
}

export class SearchDto {
  @IsNotEmpty()
  @IsEnum(OptionEnum)
  readonly option: OptionEnum;

  @IsNotEmpty()
  @IsString()
  readonly keyword: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly offset: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly limit: number;
}
