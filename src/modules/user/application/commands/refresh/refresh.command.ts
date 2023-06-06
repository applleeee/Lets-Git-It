import { ICommand } from '@nestjs/cqrs';
export class RefreshCommand implements ICommand {
  readonly id: string;
  readonly refreshToken: string;
  constructor({ id, refreshToken }) {
    this.id = id;
    this.refreshToken = refreshToken;
  }
}
