import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity('career', { schema: 'git_rank' })
export class Career {
  @PrimaryGeneratedColumn({ type: 'tinyint', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'period', nullable: true, length: 100 })
  period: string | null;

  @OneToMany(() => User, (user) => user.career)
  users: User[];
}
