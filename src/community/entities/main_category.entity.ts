import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('main_category')
export class MainCategory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 200 })
  name: string;
}
