import { Comment } from './../entities/Comment';
import { CommunityRepository } from './community.repository';
import { CreatePostDto } from './dto/createPost.dto';
import { CreateCommentDto, CreateCommentLikesDto, DeleteCommentDto, UpdateCommentDto } from './dto/comment.dto';
import { Post } from 'src/entities/Post';
import { GetPostListDto } from './dto/getPostList.dto';
import { SearchDto } from './dto/searchPost.dto';
export declare class CommunityService {
    private CommunityRepository;
    constructor(CommunityRepository: CommunityRepository);
    private getCurrentTime;
    getAllCategories(): Promise<import("../entities/SubCategory").SubCategory[]>;
    saveImageToS3(image: any, userId: number): Promise<string>;
    deleteImageInS3(toDeleteImageData: any): Promise<import("@aws-sdk/client-s3").DeleteObjectsCommandOutput | {
        message: string;
    }>;
    createPost(postData: CreatePostDto, userId: number): Promise<void>;
    getPostToUpdate(postId: number): Promise<Post>;
    updatePost(postId: number, updatedData: CreatePostDto, userId: number): Promise<void>;
    deletePost(postId: number): Promise<import("typeorm").DeleteResult>;
    getPostList(subCategoryId: number, query: GetPostListDto): Promise<any[]>;
    getPostDetail(postId: number): Promise<any>;
    getIdsOfPostsCreatedByUser(userId: number): Promise<Post[]>;
    getIdsOfPostLikedByUser(userId: number): Promise<number[]>;
    createOrDeletePostLike(data: any, userId: any): Promise<import("../entities/PostLike").PostLike | import("typeorm").DeleteResult>;
    searchPost(query: SearchDto): Promise<any[]>;
    createComment(commentData: CreateCommentDto): Promise<Comment>;
    deleteComment(criteria: DeleteCommentDto): Promise<import("typeorm").DeleteResult>;
    updateComment(criteria: UpdateCommentDto, toUpdateContent: string): Promise<import("typeorm").UpdateResult>;
    readComments(user: any, postId: number): Promise<any[]>;
    createCommentLikes(criteria: CreateCommentLikesDto): Promise<import("typeorm").DeleteResult | (CreateCommentLikesDto & import("../entities/CommentLike").CommentLike)>;
    getIdsOfCommentCreatedByUser(userId: number): Promise<Comment[]>;
    getIdsOfCommentLikedByUser(userId: number): Promise<number[]>;
}
