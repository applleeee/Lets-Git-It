import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class RankerProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  profile_image_url: string;

  @Column({ nullable: true })
  profile_text: string;

  @Column({ nullable: true })
  homepage_url: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: true })
  region: string;

  @Column({ nullable: true })
  user_id: number;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  //   @OneToOne(() => User)
  //   @JoinColumn({ name: 'user_id' })
  //   user: User;
}
