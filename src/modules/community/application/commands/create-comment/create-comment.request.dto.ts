import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export enum Depth {
  COMMENT = 1,
  RE_COMMENT,
}

export class CreateCommentRequestDto {
  @IsString()
  @IsNotEmpty()
  readonly content: string;

  @IsNumber()
  @IsNotEmpty()
  readonly groupOrder: number;

  @IsEnum(Depth)
  @IsNotEmpty()
  readonly depth: Depth;
}

export class CreateCommentDto extends CreateCommentRequestDto {
  @IsNumber()
  @IsNotEmpty()
  readonly userId: string;

  @IsNumber()
  @IsNotEmpty()
  readonly postId: string;
}
