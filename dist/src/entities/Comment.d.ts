import { User } from './User';
import { Post } from './Post';
import { CommentLike } from './CommentLike';
export declare class Comment {
    id: number;
    content: string;
    userId: number;
    postId: number;
    groupOrder: number;
    depth: number;
    createdAt: Date;
    updatedAt: Date | null;
    user: User;
    post: Post;
    commentLikes: CommentLike[];
}
