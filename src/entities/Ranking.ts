import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RankerProfile } from './RankerProfile';
import { Tier } from './Tier';

@Index('ranker_profile_id', ['rankerProfileId'], {})
@Index('tier_id', ['tierId'], {})
@Entity('ranking', { schema: 'letsgitit' })
export class Ranking {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'main_language', length: 255 })
  mainLanguage: string;

  @Column('decimal', { name: 'curiosity_score', precision: 8, scale: 4 })
  curiosityScore: string;

  @Column('decimal', { name: 'passion_score', precision: 8, scale: 4 })
  passionScore: string;

  @Column('decimal', { name: 'fame_score', precision: 8, scale: 4 })
  fameScore: string;

  @Column('decimal', { name: 'ability_score', precision: 8, scale: 4 })
  abilityScore: string;

  @Column('decimal', { name: 'total_score', precision: 9, scale: 4 })
  totalScore: string;

  @Column('int', { name: 'curiosity_raise_issue_number', unsigned: true })
  curiosityRaiseIssueNumber: number;

  @Column('int', { name: 'curiosity_fork_repository_number', unsigned: true })
  curiosityForkRepositoryNumber: number;

  @Column('int', {
    name: 'curiosity_give_star_repository_number',
    unsigned: true,
  })
  curiosityGiveStarRepositoryNumber: number;

  @Column('int', { name: 'curiosity_following_number', unsigned: true })
  curiosityFollowingNumber: number;

  @Column('int', { name: 'passion_commit_number', unsigned: true })
  passionCommitNumber: number;

  @Column('int', { name: 'passion_pr_number', unsigned: true })
  passionPrNumber: number;

  @Column('int', { name: 'passion_review_number', unsigned: true })
  passionReviewNumber: number;

  @Column('int', { name: 'passion_create_repository_number', unsigned: true })
  passionCreateRepositoryNumber: number;

  @Column('int', { name: 'fame_follower_number', unsigned: true })
  fameFollowerNumber: number;

  @Column('int', { name: 'fame_repository_forked_number', unsigned: true })
  fameRepositoryForkedNumber: number;

  @Column('int', { name: 'fame_repository_watched_number', unsigned: true })
  fameRepositoryWatchedNumber: number;

  @Column('int', { name: 'ability_sponsered_number', unsigned: true })
  abilitySponseredNumber: number;

  @Column('int', {
    name: 'ability_contribute_repository_star_number',
    unsigned: true,
  })
  abilityContributeRepositoryStarNumber: number;

  @Column('int', {
    name: 'ability_public_repository_star_number',
    unsigned: true,
  })
  abilityPublicRepositoryStarNumber: number;

  @Column('int', { name: 'ranker_profile_id', nullable: true, unsigned: true })
  rankerProfileId: number | null;

  @Column('tinyint', { name: 'tier_id', nullable: true, unsigned: true })
  tierId: number | null;

  @ManyToOne(() => RankerProfile, (rankerProfile) => rankerProfile.rankings, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'ranker_profile_id', referencedColumnName: 'id' }])
  rankerProfile: RankerProfile;

  @ManyToOne(() => RankerProfile, (rankerProfile) => rankerProfile.rankings2, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'ranker_profile_id', referencedColumnName: 'id' }])
  rankerProfile_2: RankerProfile;

  @ManyToOne(() => Tier, (tier) => tier.rankings, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'tier_id', referencedColumnName: 'id' }])
  tier: Tier;
}
