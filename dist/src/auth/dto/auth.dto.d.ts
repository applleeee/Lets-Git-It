import { Comment } from 'src/entities/Comment';
import { Post } from 'src/entities/Post';
export declare class GithubCodeDto {
    readonly code: string;
}
export declare class SignUpDto {
    readonly githubId: number;
    readonly fieldId: number;
    readonly careerId: number;
    readonly isKorean: boolean;
}
export declare class SignUpWithUserNameDto extends SignUpDto {
    readonly userName: string;
}
export declare class AuthorizedUser {
    readonly id: number;
    readonly idsOfPostsCreatedByUser?: Post[];
    readonly idsOfPostLikedByUser?: number[];
    readonly idsOfCommentsCreatedByUser?: Comment[];
    readonly idsOfCommentLikedByUser?: number[];
}
