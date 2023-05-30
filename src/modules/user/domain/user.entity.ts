import { ulid } from 'ulid';

import { CreateUserProps, UserProps } from './user.types';
import { BaseEntity } from 'src/libs/base/entity.base';

export class UserEntity extends BaseEntity<UserProps> {
  static create(create: CreateUserProps): UserEntity {
    const id = ulid();
    const props: UserProps = { ...create, isAdmin: false };
    return new UserEntity({ id, props });
  }
}
