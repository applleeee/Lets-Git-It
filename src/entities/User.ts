import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from './Comment';
import { CommentLike } from './CommentLike';
import { Post } from './Post';
import { PostLike } from './PostLike';
import { RankerProfile } from './RankerProfile';
import { Field } from './Field';
import { Career } from './Career';

@Index('field_id', ['fieldId'], {})
@Entity('user', { schema: 'git_rank' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('int', { name: 'github_id', nullable: true, unsigned: true })
  githubId: number | null;

  @Column('tinyint', { name: 'field_id', nullable: true, unsigned: true })
  fieldId: number | null;

  @Column('tinyint', { name: 'career_id', nullable: true, unsigned: true })
  careerId: number | null;

  @Column('tinyint', { name: 'is_korean', nullable: true, width: 1 })
  isKorean: boolean | null;

  @Column('tinyint', {
    name: 'is_admin',
    nullable: true,
    width: 1,
    default: () => "'0'",
  })
  isAdmin: boolean | null;

  @Column('timestamp', { name: 'created_at', default: () => "'now()'" })
  createdAt: Date;

  @Column('timestamp', { name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Comment, (comment) => comment.user_2)
  comments2: Comment[];

  @OneToMany(() => Comment, (comment) => comment.user_3)
  comments3: Comment[];

  @OneToMany(() => CommentLike, (commentLike) => commentLike.user)
  commentLikes: CommentLike[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Post, (post) => post.user_2)
  posts2: Post[];

  @OneToMany(() => PostLike, (postLike) => postLike.user)
  postLikes: PostLike[];

  @OneToMany(() => PostLike, (postLike) => postLike.user_2)
  postLikes2: PostLike[];

  @OneToMany(() => RankerProfile, (rankerProfile) => rankerProfile.user)
  rankerProfiles: RankerProfile[];

  @ManyToOne(() => Field, (field) => field.users, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'field_id', referencedColumnName: 'id' }])
  field: Field;

  @ManyToOne(() => Career, (career) => career.users, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'career_id', referencedColumnName: 'id' }])
  career: Career;
}
