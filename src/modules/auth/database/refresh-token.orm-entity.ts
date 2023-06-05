import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../user/database/entity/user.orm-entity';

@Entity('refresh_token', { schema: 'git_rank' })
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

  @ManyToOne(() => User, (user) => user.refreshToken, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
