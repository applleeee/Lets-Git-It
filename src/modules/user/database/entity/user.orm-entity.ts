import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
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

/**
 * todo 인덱스, 외래키 제약조건 네이밍하기: https://purumae.tistory.com/135
 * todo 인덱스 설계하기: https://inpa.tistory.com/entry/MYSQL-%F0%9F%93%9A-%EC%9D%B8%EB%8D%B1%EC%8A%A4index-%ED%95%B5%EC%8B%AC-%EC%84%A4%EA%B3%84-%EC%82%AC%EC%9A%A9-%EB%AC%B8%EB%B2%95-%F0%9F%92%AF-%EC%B4%9D%EC%A0%95%EB%A6%AC#%ED%9A%A8%EC%9C%A8%EC%A0%81%EC%9D%B8_%EC%9D%B8%EB%8D%B1%EC%8A%A4_%EC%84%A4%EA%B3%84
 * ^index : idx_테이블이름_숫자 => ex. idx_user_1
 * ^foreign : 부모테이블_자식테이블_컬럼명 => ex. user_ranker_profile_id
 */

@Index(['id'])
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

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
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
  @JoinColumn({
    name: 'ranker_profile_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_user_ranker_profile_id',
  })
  rankerProfiles?: RankerProfile[];

  @ManyToOne(() => Field, (field) => field.users, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([
    {
      name: 'field_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'fk_user_field_id',
    },
  ])
  field: Field;

  @ManyToOne(() => Career, (career) => career.users, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([
    {
      name: 'career_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'fk_user_career_id',
    },
  ])
  career: Career;
}
