import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';
import { Post } from './Post';
import { CommentLike } from './CommentLike';

@Index('user_id', ['userId'], {})
@Index('post_id', ['postId'], {})
@Entity('comment', { schema: 'letsgitit' })
export class Comment {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'content', nullable: true, length: 2083 })
  content: string | null;

  @Column('int', { name: 'user_id', nullable: true, unsigned: true })
  userId: number | null;

  @Column('int', { name: 'post_id', nullable: true, unsigned: true })
  postId: number | null;

  @Column('int', { name: 'group_order', unsigned: true })
  groupOrder: number;

  @Column('timestamp', { name: 'created_at', default: () => "'now()'" })
  createdAt: Date;

  @Column('timestamp', { name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(() => User, (user) => user.comments2, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user_2: User;

  @ManyToOne(() => User, (user) => user.comments3, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user_3: User;

  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'post_id', referencedColumnName: 'id' }])
  post: Post;

  @OneToMany(() => CommentLike, (commentLike) => commentLike.comment)
  commentLikes: CommentLike[];

  @OneToMany(() => CommentLike, (commentLike) => commentLike.comment_2)
  commentLikes2: CommentLike[];
}
