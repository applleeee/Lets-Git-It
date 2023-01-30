import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ nullable: true })
  start_percent: number;

  @Column({ nullable: true })
  end_percent: number;
}
