import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User as UserOrmEntity } from './user.orm-entity';
import { UserEntity } from '../domain/user.entity';
import { UserMapper } from '../user.mapper';
import { MySqlRepositoryBase } from 'src/libs/db/mysql-repository.base';
import { UserRepositoryPort } from './user.repository.port';

@Injectable()
export class UserRepository
  extends MySqlRepositoryBase<UserEntity, UserOrmEntity>
  implements UserRepositoryPort
{
  protected tableName: 'user';

  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: Repository<UserOrmEntity>,
    mapper: UserMapper,
  ) {
    super(mapper, userRepository);
  }

  async getUserByGithubId(githubId: number) {
    return await this.userRepository.findOneBy({
      githubId,
    });
  }

  // async getUserIdByGithubId(githubId: number) {
  //   const user = await this.userRepository.findOneBy({
  //     githubId,
  //   });
  //   return user.id;
  // }

  async getByUserId(id: string): Promise<UserOrmEntity> {
    return await this.userRepository.findOneBy({
      id,
    });
  }

  async createUser(entity: UserEntity) {
    const record = this.mapper.toPersistence(entity);

    try {
      return await this.userRepository.save(record);
    } catch (error) {
      console.log('createUser error: ', error);
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException('EXISTING_USERNAME', HttpStatus.CONFLICT);
      } else {
        throw new HttpException(
          'INTERNAL_SERVER_ERROR',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async updateUser(userId: string, partialEntity) {
    return await this.userRepository.update({ id: userId }, partialEntity);
  }

  async updateUserRefreshToken(id: string, hashedRefreshToken: string) {
    return await this.userRepository.update(id, { hashedRefreshToken });
  }

  async deleteUserRefreshToken(id: string) {
    const result = await this.userRepository.update(id, {
      hashedRefreshToken: null,
      updatedAt: new Date(),
    });

    return result.affected > 0;
  }
}
