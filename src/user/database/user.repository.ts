import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.orm-entity';
import { SignUpRequestDto } from '../application/commands/sign-up/sign-up.request.dto';
import { UpdateUserDto } from '../application/commands/update-user/update-user.request.dto';
import { UserEntity } from '../domain/user.entity';
import { UserMapper } from '../user.mapper';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly _mapper: UserMapper,
  ) {}

  async getUserByGithubId(githubId: number) {
    return await this.userRepository.findOneBy({
      githubId,
    });
  }

  async getUserIdByGithubId(githubId: number) {
    const user = await this.userRepository.findOneBy({
      githubId,
    });
    return user.id;
  }

  async getByUserId(id: string): Promise<User> {
    return await this.userRepository.findOneBy({
      id,
    });
  }

  async createUser(entity: UserEntity) {
    const record = this._mapper.toPersistence(entity);

    const user = this.userRepository.create(record);

    try {
      return await this.userRepository.save(user);
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

  async updateUser(userId: string, partialEntity: UpdateUserDto) {
    return await this.userRepository.update({ id: userId }, partialEntity);
  }

  async updateUserRefreshToken(id: string, hashedRefreshToken: string) {
    return await this.userRepository.update(id, { hashedRefreshToken });
  }
}
