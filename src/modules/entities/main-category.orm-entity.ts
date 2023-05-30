import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SubCategory } from './sub-category.orm-entity';

@Entity('main_category', { schema: 'git_rank' })
export class MainCategory {
  @PrimaryGeneratedColumn({ type: 'tinyint', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'name', nullable: false, length: 200 })
  name: string;

  @OneToMany(() => SubCategory, (subCategory) => subCategory.mainCategory)
  subCategories: SubCategory[];
}
