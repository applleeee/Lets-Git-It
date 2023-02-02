import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from './Comment';
import { User } from './User';
import { SubCategory } from './SubCategory';
import { PostLike } from './PostLike';

@Index('user_id', ['userId'], {})
@Index('sub_category_id', ['subCategoryId'], {})
@Entity('post', { schema: 'letsgitit' })
export class Post {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'title', nullable: true, length: 500 })
  title: string | null;

  @Column('varchar', { name: 'content_url', nullable: true, length: 2083 })
  contentUrl: string | null;

  @Column('int', { name: 'view', default: () => "'0'" })
  view: number;

  @Column('int', { name: 'user_id', nullable: true, unsigned: true })
  userId: number | null;

  @Column('tinyint', {
    name: 'sub_category_id',
    nullable: true,
    unsigned: true,
  })
  subCategoryId: number | null;

  @Column('timestamp', { name: 'created_at', default: () => "'now()'" })
  createdAt: Date;

  @Column('timestamp', { name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(() => User, (user) => user.posts2, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user_2: User;

  @ManyToOne(() => SubCategory, (subCategory) => subCategory.posts, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'sub_category_id', referencedColumnName: 'id' }])
  subCategory: SubCategory;

  @OneToMany(() => PostLike, (postLike) => postLike.post)
  postLikes: PostLike[];
}
