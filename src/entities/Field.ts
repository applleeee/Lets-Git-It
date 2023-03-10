import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity('field', { schema: 'git_rank' })
export class Field {
  @PrimaryGeneratedColumn({ type: 'tinyint', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'name', nullable: false, length: 100 })
  name: string;

  @OneToMany(() => User, (user) => user.field)
  users: User[];
}
