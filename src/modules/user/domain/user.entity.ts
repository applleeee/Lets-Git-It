import { ulid } from 'ulid';
import {
  CreateUserProps,
  UpdateUserRefreshTokenIdProps,
  UserProps,
} from './user.types';
import { BaseEntity } from 'src/libs/base/entity.base';
import { UpdateUserProps } from './user.types';

export class UserEntity extends BaseEntity<UserProps> {
  static create(create: CreateUserProps): UserEntity {
    const id = ulid();
    const props: UserProps = { ...create, isAdmin: false };
    return new UserEntity({ id, props });
  }

  update(props: UpdateUserProps): void {
    this.props.fieldId = props.fieldId;
    this.props.careerId = props.careerId;
    this.props.isKorean = props.isKorean;
  }

  updateUserRefreshTokenId(props: UpdateUserRefreshTokenIdProps) {
    this.props.refreshTokenId = props.refreshTokenId;
  }
}
