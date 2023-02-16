export declare class CreateCommentBodyDto {
    readonly content: string;
    readonly groupOrder: number;
    readonly depth: number;
}
declare const UpdateCommentBodyDto_base: import("@nestjs/mapped-types").MappedType<Pick<CreateCommentBodyDto, "content">>;
export declare class UpdateCommentBodyDto extends UpdateCommentBodyDto_base {
}
export declare class CreateCommentDto {
    readonly content: string;
    readonly groupOrder: number;
    readonly userId: number;
    readonly postId: number;
}
export declare class UpdateCommentDto {
    readonly userId: number;
    readonly id: number;
}
export declare class DeleteCommentDto extends UpdateCommentDto {
}
export declare class CreateCommentLikesDto {
    readonly userId: number;
    readonly commentId: number;
}
export {};
