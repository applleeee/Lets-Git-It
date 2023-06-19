import { RepositoryPort } from 'src/libs/base/repository.port';
import { PostEntity } from '../domain/post.entity';

export interface PostRepositoryPort extends RepositoryPort<PostEntity> {}
