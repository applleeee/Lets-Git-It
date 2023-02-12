import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity('career', { schema: 'git_rank' })
export class Career {
  @PrimaryGeneratedColumn({ type: 'tinyint', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'period', nullable: false, length: 100 })
  period: string;

  @OneToMany(() => User, (user) => user.career)
  users: User[];
}
