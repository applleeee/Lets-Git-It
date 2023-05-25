import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';

export class GetUserResponseDto {
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

  @IsString()
  readonly tierName: string;

  @IsString()
  readonly tierImage: string;

  readonly posts: PostDto[];
}

class PostDto {
  @IsString()
  title: string;

  @IsString()
  contentUrl: string;

  @IsNumber()
  subCategoryId: number;

  @IsDate()
  createdAt: Date;
}
