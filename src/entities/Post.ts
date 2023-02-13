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
import { Comment } from './Comment';
import { User } from './User';
import { SubCategory } from './SubCategory';
import { PostLike } from './PostLike';

@Index('user_id', ['userId'], {})
@Entity('post', { schema: 'git_rank' })
export class Post {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'title', nullable: false, length: 500 })
  title: string;

  @Column('varchar', { name: 'content_url', nullable: false, length: 2083 })
  contentUrl: string;

  @Column('int', { name: 'view', nullable: false, default: () => "'0'" })
  view: number;

  @Column('int', { name: 'user_id', nullable: false, unsigned: true })
  userId: number;

  @Column('tinyint', {
    name: 'sub_category_id',
    nullable: false,
    unsigned: true,
  })
  subCategoryId: number;

  @CreateDateColumn({ name: 'created_at', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(() => SubCategory, (subCategory) => subCategory.posts, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'sub_category_id', referencedColumnName: 'id' }])
  subCategory: SubCategory;

  @OneToMany(() => PostLike, (postLike) => postLike.post)
  postLikes: PostLike[];
}
