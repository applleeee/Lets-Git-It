import { IsDate, IsNumber, IsString } from 'class-validator';

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

export class myPageDto {
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

  readonly posts: PostDto[];
}
