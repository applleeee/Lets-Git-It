import { Post } from './Post';
import { User } from './User';
export declare class PostLike {
    id: number;
    postId: number;
    userId: number;
    createdAt: Date;
    updatedAt: Date | null;
    post: Post;
    user: User;
}
