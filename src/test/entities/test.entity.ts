import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class users {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name: string;
}
