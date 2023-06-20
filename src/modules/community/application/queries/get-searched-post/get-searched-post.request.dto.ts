import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { OptionEnum } from 'src/modules/community/dto/Post.dto';

export class SearchPostDto {
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
