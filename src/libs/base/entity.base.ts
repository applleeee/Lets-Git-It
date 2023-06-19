export interface BaseEntityProps {
  id: string | number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface CreateEntityProps<T> {
  id: string | number;
  props: T;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export abstract class BaseEntity<EntityProps> {
  private readonly _id: string | number;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt: Date;
  protected readonly props: EntityProps;

  constructor({
    id,
    createdAt,
    updatedAt,
    deletedAt,
    props,
  }: CreateEntityProps<EntityProps>) {
    this._id = id;
    const now = new Date();
    this._createdAt = createdAt || now;
    this._updatedAt = updatedAt || now;
    this._deletedAt = deletedAt || now;
    this.props = props;
  }

  get id() {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  public getProps(): EntityProps & BaseEntityProps {
    const propsCopy = {
      id: this._id,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      deletedAt: this._deletedAt,
      ...this.props,
    };
    return Object.freeze(propsCopy);
  }
}
