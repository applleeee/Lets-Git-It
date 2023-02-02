import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from './Post';
import { User } from './User';

@Index('post_id', ['postId'], {})
@Index('user_id', ['userId'], {})
@Entity('post_like', { schema: 'letsgitit' })
export class PostLike {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('int', { name: 'post_id', nullable: true, unsigned: true })
  postId: number | null;

  @Column('int', { name: 'user_id', nullable: true, unsigned: true })
  userId: number | null;

  @Column('timestamp', { name: 'created_at', default: () => "'now()'" })
  createdAt: Date;

  @Column('timestamp', { name: 'updated_at', nullable: true })
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

  @ManyToOne(() => User, (user) => user.postLikes2, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user_2: User;
}
