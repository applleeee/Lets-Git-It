import {
  Column,
  Entity,
  Index,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { User } from '../user/database/entity/user.orm-entity';
import { Ranking } from './ranking.orm-entity';

@Index('user_id', ['userId'], {})
@Entity('ranker_profile', { schema: 'git_rank' })
export class RankerProfile {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'name', length: 200 })
  name: string;

  @Column('varchar', {
    name: 'profile_image_url',
    nullable: true,
    length: 2083,
  })
  profileImageUrl: string | null;

  @Column('varchar', { name: 'profile_text', nullable: true, length: 500 })
  profileText: string | null;

  @Column('varchar', { name: 'homepage_url', nullable: true, length: 2083 })
  homepageUrl: string | null;

  @Column('varchar', { name: 'email', nullable: true, length: 255 })
  email: string | null;

  @Column('varchar', { name: 'company', nullable: true, length: 255 })
  company: string | null;

  @Column('varchar', { name: 'region', nullable: true, length: 255 })
  region: string | null;

  @Column('uuid', { name: 'user_id', nullable: true })
  userId: string | null;

  @CreateDateColumn({ name: 'created_at', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @OneToOne(() => User, (user) => user.rankerProfiles, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @OneToOne(() => Ranking, (ranking) => ranking.rankerProfile)
  rankings: Ranking[];
}
