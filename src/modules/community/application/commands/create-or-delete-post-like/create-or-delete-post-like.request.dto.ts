import { IsNotEmpty } from 'class-validator';

export class PostLikeDto {
  @IsNotEmpty()
  readonly postId: string;
}
