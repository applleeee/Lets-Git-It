import { RepositoryPort } from 'src/libs/base/repository.port';
import { UserEntity } from '../domain/user.entity';

export interface UserRepositoryPort extends RepositoryPort<UserEntity> {
  getUserByGithubId(githubId: number): Promise<UserEntity>;
  getUserNameByUserId(id: string): Promise<any>;
}
