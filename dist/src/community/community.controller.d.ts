import { CommunityService } from './community.service';
import { CreatePostDto } from './dto/createPost.dto';
import { CreateCommentBodyDto, CreateCommentLikesDto, UpdateCommentBodyDto } from './dto/comment.dto';
import { GetPostListDto } from './dto/getPostList.dto';
import { SearchDto } from './dto/searchPost.dto';
export declare class CommunityController {
    private communityService;
    constructor(communityService: CommunityService);
    getAllCategories(): Promise<import("../entities/SubCategory").SubCategory[]>;
    saveImageToS3(image: any, req: any): Promise<string>;
    deleteImageInS3(toDeleteImageData: any): Promise<import("@aws-sdk/client-s3").DeleteObjectsCommandOutput | {
        message: string;
    }>;
    createPost(postData: CreatePostDto, req: any): Promise<{
        message: string;
    }>;
    getPostToUpdate(postId: number, req: any): Promise<import("../entities/Post").Post | {
        message: string;
    }>;
    updatePost(postId: number, updatedData: CreatePostDto, req: any): Promise<{
        message: string;
    }>;
    deletePost(postId: number, req: any): Promise<{
        message: string;
    }>;
    getPostList(subCategoryId: number, query: GetPostListDto): Promise<any[]>;
    getPostDetail(postId: number, req: any): Promise<any>;
    createOrDeletePostLike(data: any, req: any): Promise<any>;
    searchPost(query: SearchDto): Promise<any[]>;
    createComment(body: CreateCommentBodyDto, req: any, postId: number): Promise<import("../entities/Comment").Comment>;
    deleteComment(req: any, commentId: number): Promise<import("typeorm").DeleteResult>;
    updateComment(req: any, commentId: number, body: UpdateCommentBodyDto): Promise<import("typeorm").UpdateResult>;
    getComments(req: any, postId: number): Promise<any[]>;
    createCommentLikes(req: any, commentId: number): Promise<import("typeorm").DeleteResult | (CreateCommentLikesDto & import("../entities/CommentLike").CommentLike)>;
}
