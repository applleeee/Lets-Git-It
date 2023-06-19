import { ICommand } from '@nestjs/cqrs';
import { PostLikeDto } from './create-or-delete-post-like.request.dto';

export class CreateOrDeletePostLikeCommand implements ICommand {
  readonly userId: string;
  readonly data: PostLikeDto;
  constructor({ userId, data }) {
    this.userId = userId;
    this.data = data;
  }
}
