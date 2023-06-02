import { ICommand } from '@nestjs/cqrs';

export class CreatePostCommand implements ICommand {
  readonly userId: string;
  readonly title: string;
  readonly subCategoryId: number;
  readonly content: string;
  constructor({ userId, title, subCategoryId, content }) {
    this.userId = userId;
    this.title = title;
    this.subCategoryId = subCategoryId;
    this.content = content;
  }
}
