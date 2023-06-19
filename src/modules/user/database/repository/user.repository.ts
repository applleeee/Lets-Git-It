import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User as UserOrmEntity } from '../entity/user.orm-entity';
import { UserEntity } from '../../domain/user.entity';
import { UserMapper } from '../../mapper/user.mapper';
import { MySqlRepositoryBase } from 'src/libs/db/mysql-repository.base';
import { UserRepositoryPort } from '../user.repository.port';

@Injectable()
export class UserRepository
  extends MySqlRepositoryBase<UserEntity, UserOrmEntity>
  implements UserRepositoryPort
{
  protected tableName: 'user';

  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly _userRepository: Repository<UserOrmEntity>,
    mapper: UserMapper,
  ) {
    super(mapper, _userRepository);
  }

  async getUserByGithubId(githubId: number): Promise<UserEntity> {
    const userOrmEntity = await this._userRepository.findOneBy({
      githubId,
    });

    return userOrmEntity ? this.mapper.toDomain(userOrmEntity) : null;
  }

  async getUserNameByUserId(id: string): Promise<string> {
    const userOrmEntity = await this._userRepository.findOne({
      where: { id },
      select: { rankerProfiles: { name: true } },
      relations: ['rankerProfiles'],
    });

    // todo userEntity에 rankerProfile 속성 추가하고 mapper에 적용하면 아래 로직 바꾸기.
    const name = userOrmEntity.rankerProfiles?.map((ranker) => ranker.name);

    return name ? name[0] : null;
  }
}
