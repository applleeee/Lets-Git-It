import { RepositoryPort } from 'src/libs/base/repository.port';
import { PostEntity } from '../domain/community.entity';

export interface PostRepositoryPort extends RepositoryPort<PostEntity> {}
