import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Ranking } from './ranking.orm-entity';

@Entity('tier', { schema: 'git_rank' })
export class Tier {
  @PrimaryGeneratedColumn({ type: 'tinyint', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'name', nullable: true, length: 200 })
  name: string | null;

  @Column('varchar', { name: 'image_url', nullable: true, length: 2083 })
  imageUrl: string | null;

  @Column('decimal', {
    name: 'start_percent',
    nullable: true,
    precision: 7,
    scale: 4,
  })
  startPercent: string | null;

  @Column('decimal', {
    name: 'end_percent',
    nullable: true,
    precision: 7,
    scale: 4,
  })
  endPercent: string | null;

  @OneToMany(() => Ranking, (ranking) => ranking.tier)
  rankings: Ranking[];
}
