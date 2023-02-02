import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from './Comment';
import { User } from './User';

@Index('comment_id', ['commentId'], {})
@Index('user_id', ['userId'], {})
@Entity('comment_like', { schema: 'letsgitit' })
export class CommentLike {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('int', { name: 'comment_id', nullable: true, unsigned: true })
  commentId: number | null;

  @Column('int', { name: 'user_id', nullable: true, unsigned: true })
  userId: number | null;

  @Column('timestamp', { name: 'created_at', default: () => "'now()'" })
  createdAt: Date;

  @Column('timestamp', { name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @ManyToOne(() => Comment, (comment) => comment.commentLikes, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'comment_id', referencedColumnName: 'id' }])
  comment: Comment;

  @ManyToOne(() => Comment, (comment) => comment.commentLikes2, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'comment_id', referencedColumnName: 'id' }])
  comment_2: Comment;

  @ManyToOne(() => User, (user) => user.commentLikes, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
