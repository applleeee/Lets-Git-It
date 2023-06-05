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
    mapper: RefreshTokenMapper, // todo mapper 구현 후 타입 추가
  ) {
    super(mapper, _refreshTokenRepository);
  }

  async updateUserRefreshToken(id: string, hashedRefreshToken: string) {
    return await this._refreshTokenRepository.update(id, {
      hashedRefreshToken,
    });
  }

  async deleteUserRefreshToken(id: string) {
    const result = await this._refreshTokenRepository.update(id, {
      hashedRefreshToken: null,
      updatedAt: new Date(),
    });

    return result.affected > 0;
  }
}
