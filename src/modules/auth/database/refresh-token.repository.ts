import { MySqlRepositoryBase } from 'src/libs/db/mysql-repository.base';
import { RefreshTokenEntity } from '../domain/refresh-token.entity';
import { Injectable } from '@nestjs/common';
import { RefreshToken as RefreshTokenOrmEntity } from './refresh-token.orm-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshTokenRepositoryPort } from './refresh-token.repository.port';
import { RefreshTokenMapper } from '../mapper/refresh-token.mapper';

@Injectable()
export class RefreshTokenRepository
  extends MySqlRepositoryBase<RefreshTokenEntity, RefreshTokenOrmEntity>
  implements RefreshTokenRepositoryPort
{
  protected tableName: 'refreshToken';

  constructor(
    @InjectRepository(RefreshTokenOrmEntity)
    private readonly _refreshTokenRepository: Repository<RefreshTokenOrmEntity>,
    mapper: RefreshTokenMapper,
  ) {
    super(mapper, _refreshTokenRepository);
  }

  async deleteRefreshToken(id: string) {
    //soft delete 쓰는거 어때
    const result = await this._refreshTokenRepository.update(id, {
      hashedRefreshToken: null,
      updatedAt: new Date(),
    });

    return result.affected > 0;
  }

  async findOneByUserId(userId: string) {
    const record = await this._refreshTokenRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    return this.mapper.toDomain(record);
  }
}
