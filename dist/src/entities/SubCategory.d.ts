import { Post } from './Post';
import { MainCategory } from './MainCategory';
export declare class SubCategory {
    id: number;
    name: string;
    mainCategoryId: number;
    posts: Post[];
    mainCategory: MainCategory;
}
