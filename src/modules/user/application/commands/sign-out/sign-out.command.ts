import { ICommand } from '@nestjs/cqrs';

export class SignOutCommand implements ICommand {
  constructor(readonly userId: string) {
    this.userId = userId;
  }
}
