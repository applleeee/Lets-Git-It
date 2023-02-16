import { Comment } from './Comment';
import { User } from './User';
import { SubCategory } from './SubCategory';
import { PostLike } from './PostLike';
export declare class Post {
    id: number;
    title: string;
    contentUrl: string;
    view: number;
    userId: number;
    subCategoryId: number;
    createdAt: Date;
    updatedAt: Date | null;
    comments: Comment[];
    user: User;
    subCategory: SubCategory;
    postLikes: PostLike[];
}
