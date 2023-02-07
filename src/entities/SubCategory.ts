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

  @Column('varchar', { name: 'name', nullable: true, length: 200 })
  name: string | null;

  @Column('tinyint', {
    name: 'main_category_id',
    nullable: true,
    unsigned: true,
  })
  mainCategoryId: number | null;

  @OneToMany(() => Post, (post) => post.subCategory)
  posts: Post[];

  @ManyToOne(() => MainCategory, (mainCategory) => mainCategory.subCategories, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'main_category_id', referencedColumnName: 'id' }])
  mainCategory: MainCategory;
}
