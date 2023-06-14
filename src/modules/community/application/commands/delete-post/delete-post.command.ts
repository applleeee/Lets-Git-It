import { ICommand } from '@nestjs/cqrs';

export class DeletePostCommand implements ICommand {
  readonly postId: string;
  constructor({ postId }) {
    this.postId = postId;
  }
}
