import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SubCategory } from "./SubCategory";

@Entity("main_category", { schema: "git_rank" })
export class MainCategory {
  @PrimaryGeneratedColumn({ type: "tinyint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 200 })
  name: string | null;

  @OneToMany(() => SubCategory, (subCategory) => subCategory.mainCategory)
  subCategories: SubCategory[];
}
