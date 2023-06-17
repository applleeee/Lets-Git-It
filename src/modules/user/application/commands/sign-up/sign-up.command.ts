import { CareerId, FieldId } from './../../../domain/user-category.types';
import { ICommand } from '@nestjs/cqrs';

export class SignUpCommand implements ICommand {
  readonly githubId: number;
  readonly fieldId: FieldId;
  readonly careerId: CareerId;
  readonly isKorean: boolean;
  readonly userName: string;

  constructor({ githubId, fieldId, careerId, isKorean, userName }) {
    this.githubId = githubId;
    this.fieldId = fieldId;
    this.careerId = careerId;
    this.isKorean = isKorean;
    this.userName = userName;
  }
}
