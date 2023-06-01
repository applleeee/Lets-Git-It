import { ICommand } from '@nestjs/cqrs';

export class UpdateUserCommand implements ICommand {
  readonly id: string;
  readonly fieldId: number;
  readonly careerId: number;
  readonly isKorean: boolean;

  constructor({ id, fieldId, careerId, isKorean }) {
    this.id = id;
    this.fieldId = fieldId;
    this.careerId = careerId;
    this.isKorean = isKorean;
  }
}
