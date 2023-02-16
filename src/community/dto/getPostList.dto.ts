import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export enum SortEnum {
  latest = 'latest',
  mostLiked = 'mostLiked',
}

export enum DateEnum {
  all = 'all',
  year = 'year',
  month = 'month',
  week = 'week',
  day = 'day',
}

export class GetPostListDto {
  @IsNotEmpty()
  @IsEnum(SortEnum)
  readonly sort: SortEnum;

  @IsOptional()
  @IsEnum(DateEnum)
  readonly date: DateEnum;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly offset: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly limit: number;
}
