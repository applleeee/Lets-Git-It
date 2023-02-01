import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RankerProfile } from './ranker_profile.entity';
import { Tier } from './tier.entity';

@Entity()
export class Ranking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  main_language: string;

  @Column()
  curiosity_score: number;

  @Column()
  passion_score: number;

  @Column()
  fame_score: number;

  @Column()
  ability_score: number;

  @Column()
  total_score: number;

  @Column()
  curiosity_raise_issue_number: number;

  @Column()
  curiosity_fork_repository_number: number;

  @Column()
  curiosity_give_start_repository_number: number;

  @Column()
  curiosity_following_number: number;

  @Column()
  passion_commit_number: number;

  @Column()
  passion_pr_number: number;

  @Column()
  passion_review_number: number;

  @Column()
  passion_create_repository_number: number;

  @Column()
  fame_follower_number: number;

  @Column()
  fame_repository_forked_number: number;

  @Column()
  fame_repository_watched_number: number;

  @Column()
  ability_sponsored_number: number;

  @Column()
  ability_contribute_repository_star_number: number;

  @Column()
  ability_public_repository_star_number: number;

  @OneToOne((type) => RankerProfile)
  @JoinColumn({ name: 'ranker_profile_id' })
  ranker_profile_id: Ranking[];

  @ManyToOne((type) => Tier)
  @JoinColumn({ name: 'tier_id' })
  tier_id: Tier[];
}
