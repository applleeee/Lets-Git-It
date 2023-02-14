import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class UpdateMyPageDto {
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

export class PostDto {
  @IsString()
  title: string;

  @IsString()
  contentUrl: string;

  @IsNumber()
  subCategoryId: number;

  @IsDate()
  createdAt: Date;
}

export class MyPageDto {
  @IsString()
  readonly userName: string;

  @IsString()
  readonly email: string;

  @IsString()
  readonly profileText: string;

  @IsString()
  readonly profileImageUrl: string;

  @IsNumber()
  readonly fieldId: number;

  @IsNumber()
  readonly careerId: number;

  @IsBoolean()
  readonly isKorean: boolean;

  readonly posts: PostDto[];
}
