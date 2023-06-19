import {
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  UpdateResult,
} from 'typeorm';
import { BaseEntity } from '../base/entity.base';
import { Mapper } from '../base/mapper.interface';
import {
  Paginated,
  PaginatedQueryParams,
  RepositoryPort,
} from '../base/repository.port';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpsertOptions } from 'typeorm/repository/UpsertOptions';

export abstract class MySqlRepositoryBase<
  Entity extends BaseEntity<any>,
  OrmEntity extends ObjectLiteral,
> implements RepositoryPort<Entity>
{
  protected abstract tableName: string;

  protected constructor(
    protected readonly mapper: Mapper<Entity, OrmEntity>,
    private readonly _repository: Repository<OrmEntity>,
  ) {}

  async insert(entity: Entity): Promise<boolean> {
    const record = this.mapper.toPersistence(entity);

    try {
      await this.repository.save(record, { reload: false });

      return true;
    } catch (error) {
      console.log(`${this.tableName} insert error : ${error}`);
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(`EXISTING_${this.tableName}`);
      } else {
        throw new InternalServerErrorException('INTERNAL_SERVER_ERROR');
      }
    }
  }

  /**
   * 추후 삭제될 수 있음 사용시 유의해주세요
   * @param entity
   * @returns
   */

  async upsertByUserId(entity: Entity): Promise<boolean> {
    const record = this.mapper.toPersistence(entity);
    const conflictPathsOrOptions: string[] | UpsertOptions<OrmEntity> = [
      'userId',
    ];

    const result = await this._repository.upsert(
      record,
      conflictPathsOrOptions,
    );

    console.log('result: ', result);
    return result.raw.affectedRows > 0;
  }

  async findOneById(id: string): Promise<Entity> {
    const record = await this.repository.findOne({
      where: { id } as unknown as FindOptionsWhere<OrmEntity>,
    });

    return this.mapper.toDomain(record);
  }

  async findAll(): Promise<Entity[]> {
    const records = await this.repository.find();

    return records.map(this.mapper.toDomain);
  }

  async findAllPaginated(
    params: PaginatedQueryParams,
  ): Promise<Paginated<Entity>> {
    throw new Error('Method not implemented.');
  }

  async update(entity: Entity): Promise<boolean> {
    const ormEntity = this.mapper.toPersistence(entity);

    const result: UpdateResult = await this.repository.update(
      ormEntity.id,
      ormEntity,
    );

    return result.affected > 0;
  }

  async remove(entity: Entity): Promise<boolean> {
    const ormEntity = this.mapper.toPersistence(entity);
    const removedEntity = await this.repository.remove(ormEntity);

    return removedEntity !== null;
  }

  /**
   * 추후 삭제될 수 있음 사용시 유의해주세요
   * @param entity
   * @returns
   */
  async softRemove(entity: Entity): Promise<boolean> {
    const ormEntity = this.mapper.toPersistence(entity);
    const removedEntity = await this.repository.softRemove(ormEntity);

    return removedEntity !== null;
  }

  protected get repository() {
    return this._repository;
  }
}
