import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/database/entity/user.orm-entity';
import { Exclude } from 'class-transformer';

@Entity('refresh_token', { schema: 'git_rank' })
export class RefreshToken {
  @PrimaryColumn({ type: 'uuid', name: 'id' })
  id: string;

  @Column('varchar', {
    name: 'hashed_refresh_token',
    nullable: true,
  })
  hashedRefreshToken?: string | null;

  @Column({ name: 'user_id', nullable: false, type: 'uuid' })
  userId: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
  updatedAt?: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => User, (user) => user.refreshToken, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'user_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'fk_refresh_token_user_id',
    },
  ])
  user: User;
}
