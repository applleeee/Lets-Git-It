import { RefreshTokenEntity } from './../domain/refresh-token.entity';
import { RepositoryPort } from 'src/libs/base/repository.port';

export interface RefreshTokenRepositoryPort
  extends RepositoryPort<RefreshTokenEntity> {
  deleteUserRefreshToken(id: string): Promise<boolean>;
  updateUserRefreshToken(id: string, hashedRefreshToken: string);
}
