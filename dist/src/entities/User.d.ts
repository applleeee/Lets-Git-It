import { Comment } from './Comment';
import { CommentLike } from './CommentLike';
import { Post } from './Post';
import { PostLike } from './PostLike';
import { RankerProfile } from './RankerProfile';
import { Field } from './Field';
import { Career } from './Career';
export declare class User {
    id: number;
    githubId: number;
    fieldId: number;
    careerId: number;
    isKorean: boolean | null;
    isAdmin: boolean | null;
    createdAt: Date;
    updatedAt: Date | null;
    comments: Comment[];
    commentLikes: CommentLike[];
    posts: Post[];
    postLikes: PostLike[];
    rankerProfiles: RankerProfile[];
    field: Field;
    career: Career;
}
