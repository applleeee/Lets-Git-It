import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MainCategory } from './main_category.entity';

@Entity('sub_category')
export class SubCategory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column()
  @OneToOne((type) => MainCategory)
  @JoinColumn({ name: 'main_category_id' })
  main_category_id: number;
}
