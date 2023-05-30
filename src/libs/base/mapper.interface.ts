import { BaseEntity } from './entity.base';

export interface Mapper<
  Entity extends BaseEntity<any>,
  DbRecord,
  Response = any,
> {
  toPersistence(entity: Entity): DbRecord;
  toDomain(record: any): Entity;
  toResponse(entity: Entity): Response;
}
