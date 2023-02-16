export declare class UpdateMyPageDto {
    readonly fieldId: number;
    readonly careerId: number;
    readonly isKorean: boolean;
}
export declare class PostDto {
    title: string;
    contentUrl: string;
    subCategoryId: number;
    createdAt: Date;
}
export declare class MyPageDto {
    readonly userName: string;
    readonly email: string;
    readonly profileText: string;
    readonly profileImageUrl: string;
    readonly fieldId: number;
    readonly careerId: number;
    readonly isKorean: boolean;
    readonly posts: PostDto[];
}
