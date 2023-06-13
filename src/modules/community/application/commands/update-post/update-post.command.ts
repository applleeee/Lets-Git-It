import { ICommand } from '@nestjs/cqrs';

export class UpdatePostCommand implements ICommand {
  readonly postId: string;
  readonly userId: string;
  readonly title: string;
  readonly subCategoryId: number;
  readonly content: string;
  constructor({ postId, userId, title, subCategoryId, content }) {
    this.postId = postId;
    this.userId = userId;
    this.title = title;
    this.subCategoryId = subCategoryId;
    this.content = content;
  }
}
