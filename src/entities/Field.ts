import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity('field', { schema: 'letsgitit' })
export class Field {
  @PrimaryGeneratedColumn({ type: 'tinyint', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'name', nullable: true, length: 100 })
  name: string | null;

  @OneToMany(() => User, (user) => user.field)
  users: User[];
}
