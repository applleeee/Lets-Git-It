import { ICommand } from '@nestjs/cqrs';

export class SaveImageToS3Command implements ICommand {
  readonly userId: string | number;
  readonly image: Express.Multer.File;
  constructor({ userId, image }) {
    this.userId = userId;
    this.image = image;
  }
}
