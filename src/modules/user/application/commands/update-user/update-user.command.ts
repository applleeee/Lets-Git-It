import { CareerId, FieldId } from './../../../domain/user-category.types';
import { ICommand } from '@nestjs/cqrs';

export class UpdateUserCommand implements ICommand {
  readonly id: string;
  readonly fieldId: FieldId;
  readonly careerId: CareerId;
  readonly isKorean: boolean;

  constructor({ id, fieldId, careerId, isKorean }) {
    this.id = id;
    this.fieldId = fieldId;
    this.careerId = careerId;
    this.isKorean = isKorean;
  }
}
