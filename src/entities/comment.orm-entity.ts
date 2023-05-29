import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/database/user.orm-entity';
import { Post } from './post.orm-entity';
import { CommentLike } from './comment-like.orm-entity';

@Index('post_id', ['postId'], {})
@Entity('comment', { schema: 'git_rank' })
export class Comment {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'content', nullable: false, length: 2083 })
  content: string;

  @Column('uuid', { name: 'user_id', nullable: false })
  userId: string;

  @Column('int', { name: 'post_id', nullable: false, unsigned: true })
  postId: number;

  @Column('int', { name: 'group_order', nullable: false, unsigned: true })
  groupOrder: number;

  @Column('int', { name: 'depth', nullable: true, unsigned: true })
  depth: number;

  @CreateDateColumn({ name: 'created_at', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'post_id', referencedColumnName: 'id' }])
  post: Post;

  @OneToMany(() => CommentLike, (commentLike) => commentLike.comment)
  commentLikes: CommentLike[];
}
