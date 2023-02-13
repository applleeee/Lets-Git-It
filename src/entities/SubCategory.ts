import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from './Post';
import { MainCategory } from './MainCategory';

@Index('main_category_id', ['mainCategoryId'], {})
@Entity('sub_category', { schema: 'git_rank' })
export class SubCategory {
  @PrimaryGeneratedColumn({ type: 'tinyint', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'name', nullable: false, length: 200 })
  name: string;

  @Column('tinyint', {
    name: 'main_category_id',
    nullable: false,
    unsigned: true,
  })
  mainCategoryId: number;

  @OneToMany(() => Post, (post) => post.subCategory)
  posts: Post[];

  @ManyToOne(() => MainCategory, (mainCategory) => mainCategory.subCategories, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'main_category_id', referencedColumnName: 'id' }])
  mainCategory: MainCategory;
}
