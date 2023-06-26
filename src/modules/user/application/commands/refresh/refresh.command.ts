import { ICommand } from '@nestjs/cqrs';
export class RefreshCommand implements ICommand {
  readonly id: string;

  constructor({ id }) {
    this.id = id;
  }
}
