import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { Field } from './field.orm-entity';
import { Career } from './career.orm-entity';
import { BooleanTransformer } from 'src/utils/boolean-transformer';
import { Comment } from 'src/modules/entities/comment.orm-entity';
import { CommentLike } from 'src/modules/entities/comment-like.orm-entity';
import { Post } from 'src/modules/entities/post.orm-entity';
import { PostLike } from 'src/modules/entities/post-like.orm-entity';
import { RankerProfile } from 'src/modules/entities/ranker-profile.orm-entity';
import { RefreshToken } from '../../../auth/database/refresh-token.orm-entity';

// todo 인덱스 이게 맞아..?
@Index('field_id', ['fieldId'], {})
@Unique(['githubId'])
@Entity('user', { schema: 'git_rank' })
export class User {
  @PrimaryColumn({ type: 'uuid', name: 'id' })
  id: string;

  @Column('int', { name: 'github_id', nullable: false, unsigned: true })
  githubId: number;

  @Column('tinyint', { name: 'field_id', nullable: false, unsigned: true })
  fieldId: number;

  @Column('tinyint', { name: 'career_id', nullable: false, unsigned: true })
  careerId: number;

  @Column('tinyint', {
    name: 'is_korean',
    nullable: true,
    width: 1,
    transformer: new BooleanTransformer(),
  })
  isKorean: boolean | null;

  @Column('tinyint', {
    name: 'is_admin',
    nullable: true,
    transformer: new BooleanTransformer(),
    width: 1,
    default: () => "'0'",
  })
  isAdmin: boolean | null;

  @Column('uuid', {
    name: 'refresh_token_id',
    nullable: true,
  })
  refreshTokenId?: string;

  @Column('timestamp', { name: 'created_at', default: () => "'now()'" })
  createdAt: Date;

  @Column('timestamp', { name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments?: Comment[];

  @OneToMany(() => CommentLike, (commentLike) => commentLike.user)
  commentLikes?: CommentLike[];

  @OneToMany(() => Post, (post) => post.user)
  posts?: Post[];

  @OneToMany(() => PostLike, (postLike) => postLike.user)
  postLikes?: PostLike[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, {
    cascade: ['insert', 'update'],
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'refresh_token_id', referencedColumnName: 'id' })
  refreshToken?: RefreshToken[];

  @OneToOne(() => RankerProfile, (rankerProfile) => rankerProfile.user)
  @JoinColumn({ name: 'rankerProfile_id', referencedColumnName: 'id' })
  rankerProfiles?: RankerProfile[];

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
