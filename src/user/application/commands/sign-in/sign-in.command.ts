import { ICommand } from '@nestjs/cqrs';

export class SignInCommand implements ICommand {
  readonly code: string;
  constructor({ code }) {
    this.code = code;
  }
}
