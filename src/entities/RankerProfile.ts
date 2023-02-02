import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';
import { Ranking } from './Ranking';

@Index('user_id', ['userId'], {})
@Entity('ranker_profile', { schema: 'letsgitit' })
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

  @Column('int', { name: 'user_id', nullable: true, unsigned: true })
  userId: number | null;

  @Column('timestamp', { name: 'created_at', default: () => "'now()'" })
  createdAt: Date;

  @Column('timestamp', { name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @ManyToOne(() => User, (user) => user.rankerProfiles, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(() => Ranking, (ranking) => ranking.rankerProfile)
  rankings: Ranking[];

  @OneToMany(() => Ranking, (ranking) => ranking.rankerProfile_2)
  rankings2: Ranking[];
}
