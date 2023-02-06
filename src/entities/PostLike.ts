import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from './Post';
import { User } from './User';

@Index('post_id', ['postId'], {})
@Entity('post_like', { schema: 'git_rank' })
export class PostLike {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('int', { name: 'post_id', nullable: true, unsigned: true })
  postId: number | null;

  @Column('int', { name: 'user_id', nullable: true, unsigned: true })
  userId: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date | null;

  @ManyToOne(() => Post, (post) => post.postLikes, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'post_id', referencedColumnName: 'id' }])
  post: Post;

  @ManyToOne(() => User, (user) => user.postLikes, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
