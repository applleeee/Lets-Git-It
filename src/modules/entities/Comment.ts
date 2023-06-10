import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { User } from './User';
import { Post } from './Post';
import { CommentLike } from './CommentLike';

@Index('post_id', ['postId'], {})
@Entity('comment', { schema: 'git_rank' })
export class Comment {
  @PrimaryColumn({ type: 'varchar', name: 'id' })
  id: string;

  @Column('varchar', { name: 'content', nullable: false, length: 2083 })
  content: string;

  @Column('varchar', { name: 'user_id', nullable: false })
  userId: string;

  @Column('varchar', { name: 'post_id', nullable: false })
  postId: string;

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
