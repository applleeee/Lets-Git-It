export class Paginated<T> {
  readonly limit: number;
  readonly page: number;
  readonly data: readonly T[];

  constructor(props: Paginated<T>) {
    this.limit = props.limit;
    this.page = props.page;
    this.data = props.data;
  }
}

export type OrderBy = { field: string; param: 'asc' | 'desc' };

export type PaginatedQueryParams = {
  limit: number;
  offset: number;
  orderBy?: OrderBy;
};

export interface RepositoryPort<Entity> {
  insert(entity: Entity): Promise<void>;
  findOneById(id: string): Promise<Entity>;
  findAll(): Promise<Entity[]>;
  findAllPaginated(params: PaginatedQueryParams): Promise<Paginated<Entity>>;
  delete(entity: Entity): Promise<Entity>;
  update(entity: Entity): Promise<boolean>;
}
