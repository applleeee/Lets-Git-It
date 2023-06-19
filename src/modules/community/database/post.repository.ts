import { Injectable } from '@nestjs/common';
import { MySqlRepositoryBase } from 'src/libs/db/mysql-respository.base';
import { PostEntity } from '../domain/post.entity';
import { Post as PostOrmEntity } from 'src/modules/entities/Post';
import { PostRepositoryPort } from './post.repository.port';
import { InjectRepository } from '@nestjs/typeorm';
import { PostMapper } from '../mapper/post.mapper';
import { Repository } from 'typeorm';

@Injectable()
export class PostRepository
  extends MySqlRepositoryBase<PostEntity, PostOrmEntity>
  implements PostRepositoryPort
{
  protected tableName: string;

  constructor(
    @InjectRepository(PostOrmEntity)
    private readonly postRepository: Repository<PostOrmEntity>,
    mapper: PostMapper,
  ) {
    super(mapper, postRepository);
  }

  // async createPost(entity: PostEntity) {
  //   const record = this.mapper.toPersistence(entity);
  //   try {
  //     return await this.postRepository.save(record);
  //   } catch (error) {
  //     throw new HttpException(
  //       'CANNOT_SAVE_POST_IN_DB',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }
}
