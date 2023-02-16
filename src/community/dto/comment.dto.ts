import { PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentBodyDto {
  @IsString()
  @IsNotEmpty()
  readonly content: string;

  @IsNumber()
  @IsNotEmpty()
  readonly groupOrder: number;

  @IsNumber()
  @IsNotEmpty()
  readonly depth: number;
}

export class UpdateCommentBodyDto extends PickType(CreateCommentBodyDto, [
  'content',
] as const) {}

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  readonly content: string;

  @IsNumber()
  @IsNotEmpty()
  readonly groupOrder: number;

  @IsNumber()
  @IsNotEmpty()
  readonly userId: number;

  @IsNumber()
  @IsNotEmpty()
  readonly postId: number;
}

export class UpdateCommentDto {
  @IsNumber()
  @IsNotEmpty()
  readonly userId: number;

  @IsNumber()
  @IsNotEmpty()
  readonly id: number;
}

export class DeleteCommentDto extends UpdateCommentDto {}

export class CreateCommentLikesDto {
  @IsNumber()
  @IsNotEmpty()
  readonly userId: number;

  @IsNumber()
  @IsNotEmpty()
  readonly commentId: number;
}
