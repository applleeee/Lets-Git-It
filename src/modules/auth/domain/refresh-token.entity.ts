import { BaseEntity } from 'src/libs/base/entity.base';
import { CreateRefreshTokenProps, RefreshTokenProps } from './auth.types';
import { ulid } from 'ulid';

export class RefreshTokenEntity extends BaseEntity<RefreshTokenProps> {
  static create(create: CreateRefreshTokenProps): RefreshTokenEntity {
    const id = ulid();
    const props: RefreshTokenProps = { ...create };
    return new RefreshTokenEntity({ id, props });
  }
}
