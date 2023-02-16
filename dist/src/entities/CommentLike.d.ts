import { Comment } from './Comment';
import { User } from './User';
export declare class CommentLike {
    id: number;
    commentId: number;
    userId: number;
    createdAt: Date;
    updatedAt: Date | null;
    comment: Comment;
    user: User;
}
