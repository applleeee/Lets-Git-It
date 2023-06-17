import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { User } from '../../user/database/entity/user.orm-entity';
import { Exclude } from 'class-transformer';

@Entity('refresh_token', { schema: 'git_rank' })
@Unique(['userId'])
export class RefreshToken {
  @PrimaryColumn({ type: 'uuid', name: 'id' })
  id: string;

  @Column('varchar', {
    name: 'hashed_refresh_token',
    nullable: true,
  })
  hashedRefreshToken: string | null;

  @Column({ name: 'user_id', nullable: false, type: 'uuid' })
  userId: string;

  @Column('timestamp', { name: 'created_at', default: () => "'now()'" })
  createdAt: Date;

  @Column('timestamp', { name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @Exclude()
  @Column('timestamp', { name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => User, (user) => user.refreshToken, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
