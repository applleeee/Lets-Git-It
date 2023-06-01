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
import { Comment } from './comment.orm-entity';
import { User } from '../user/database/entity/user.orm-entity';
import { SubCategory } from './sub-category.orm-entity';
import { PostLike } from './post-like.orm-entity';

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

  @Column('uuid', { name: 'user_id', nullable: false })
  userId: string;

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

  @Column('tinyint', {
    name: 'fixed_category_id',
    nullable: true,
    unsigned: true,
  })
  fixedCategoryId: number | null;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',
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
