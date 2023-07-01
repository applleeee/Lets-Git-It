import { ICommand } from '@nestjs/cqrs';
import { AuthorizedUser } from 'src/modules/auth/dto/auth.dto';
import { CreateCommentDto } from './create-comment.request.dto';

export class CreateCommentCommand implements ICommand {
  readonly user: Partial<AuthorizedUser>;
  readonly commentData: CreateCommentDto;
  constructor({ user, commentData }) {
    this.user = user;
    this.commentData = commentData;
  }
}
