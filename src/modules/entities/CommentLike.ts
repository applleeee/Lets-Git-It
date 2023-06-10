import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { Comment } from './Comment';
import { User } from './User';

@Index('comment_id', ['commentId'], {})
@Entity('comment_like', { schema: 'git_rank' })
export class CommentLike {
  @PrimaryColumn({ type: 'varchar', name: 'id' })
  id: string;

  @Column('varchar', { name: 'comment_id', nullable: false })
  commentId: string;

  @Column('varchar', { name: 'user_id', nullable: false })
  userId: string;

  @CreateDateColumn({ name: 'created_at', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @ManyToOne(() => Comment, (comment) => comment.commentLikes, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'comment_id', referencedColumnName: 'id' }])
  comment: Comment;

  @ManyToOne(() => User, (user) => user.commentLikes, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
