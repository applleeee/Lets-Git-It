import { ulid } from 'ulid';
import { BaseEntity } from './entity.base';
import { CreateUserProps, UserProps } from './user.types';

export class UserEntity extends BaseEntity<UserProps> {
  static create(create: CreateUserProps): UserEntity {
    const id = ulid();
    const props: UserProps = { ...create, isAdmin: false };
    return new UserEntity({ id, props });
  }
}
