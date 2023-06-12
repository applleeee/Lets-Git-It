import { ICommand } from '@nestjs/cqrs';

export class DeleteImageInS3Command implements ICommand {
  readonly toDeleteImage: string[];
  constructor({ toDeleteImage }) {
    this.toDeleteImage = toDeleteImage;
  }
}
