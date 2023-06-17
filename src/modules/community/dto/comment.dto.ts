import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsEnum } from 'class-validator';
import { AuthorizedUser } from 'src/modules/auth/domain/auth.types';

export enum Depth {
  COMMENT = 1,
  RE_COMMENT,
}

export class CreateCommentBodyDto {
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

export class UpdateCommentBodyDto extends PickType(CreateCommentBodyDto, [
  'content',
] as const) {}

export class CreateCommentDto extends CreateCommentBodyDto {
  @IsNumber()
  @IsNotEmpty()
  readonly userId: string;

  @IsNumber()
  @IsNotEmpty()
  readonly postId: number;
}

export class UpdateCommentDto {
  @IsNumber()
  @IsNotEmpty()
  readonly user: AuthorizedUser;

  @IsNumber()
  @IsNotEmpty()
  readonly id: number;
}

export class DeleteCommentDto extends UpdateCommentDto {
  @IsNumber()
  @IsNotEmpty()
  readonly groupOrder: number;

  @IsNumber()
  @IsNotEmpty()
  readonly postId: number;

  @IsEnum(Depth)
  @IsNotEmpty()
  readonly depth: Depth;
}

export class DeleteCommentBodyDto extends PickType(DeleteCommentDto, [
  'groupOrder',
  'depth',
  'postId',
] as const) {}

export class CreateOrDeleteCommentLikesDto {
  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  @IsNumber()
  @IsNotEmpty()
  readonly commentId: number;
}
