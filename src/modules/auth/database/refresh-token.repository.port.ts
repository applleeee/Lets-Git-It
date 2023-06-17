import { RefreshTokenEntity } from '../domain/refresh-token.entity';
import { RepositoryPort } from 'src/libs/base/repository.port';

export interface RefreshTokenRepositoryPort
  extends RepositoryPort<RefreshTokenEntity> {
  deleteRefreshToken(id: string): Promise<boolean>;
  deleteRefreshTokenByUserId(id: string): Promise<boolean>;
}
