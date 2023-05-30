import { ICommand } from '@nestjs/cqrs';

export class SignOutCommand implements ICommand {
  readonly userId: string;
  constructor({ userId }) {
    this.userId = userId;
  }
}
