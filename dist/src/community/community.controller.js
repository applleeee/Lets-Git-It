"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const platform_express_1 = require("@nestjs/platform-express");
const community_service_1 = require("./community.service");
const createPost_dto_1 = require("./dto/createPost.dto");
const comment_dto_1 = require("./dto/comment.dto");
const getPostList_pipe_1 = require("./pipe/getPostList.pipe");
const optionalGuard_1 = require("./guard/optionalGuard");
const getPostList_dto_1 = require("./dto/getPostList.dto");
const searchPost_dto_1 = require("./dto/searchPost.dto");
let CommunityController = class CommunityController {
    constructor(communityService) {
        this.communityService = communityService;
    }
    async getAllCategories() {
        return await this.communityService.getAllCategories();
    }
    async saveImageToS3(image, req) {
        try {
            const userId = req.user.id;
            return await this.communityService.saveImageToS3(image, userId);
        }
        catch (err) {
            console.log(err);
            throw new Error(err);
        }
    }
    async deleteImageInS3(toDeleteImageData) {
        return await this.communityService.deleteImageInS3(toDeleteImageData);
    }
    async createPost(postData, req) {
        try {
            const userId = req.user.id;
            await this.communityService.createPost(postData, userId);
            return { message: 'post created' };
        }
        catch (err) {
            console.log(err);
            throw new Error(err);
        }
    }
    async getPostToUpdate(postId, req) {
        const { idsOfPostsCreatedByUser } = req.user;
        try {
            if (idsOfPostsCreatedByUser.includes(postId)) {
                return await this.communityService.getPostToUpdate(postId);
            }
            else {
                return { message: 'This user has never written that post.' };
            }
        }
        catch (err) {
            console.log(err);
            throw new Error(err);
        }
    }
    async updatePost(postId, updatedData, req) {
        const { idsOfPostsCreatedByUser } = req.user;
        const userId = req.user.id;
        try {
            if (idsOfPostsCreatedByUser.includes(postId)) {
                await this.communityService.updatePost(postId, updatedData, userId);
                return { message: 'post updated' };
            }
            else {
                return { message: 'This user has never written that post.' };
            }
        }
        catch (err) {
            console.log(err);
            throw new Error(err);
        }
    }
    async deletePost(postId, req) {
        const { idsOfPostsCreatedByUser } = req.user;
        console.log(idsOfPostsCreatedByUser);
        if (idsOfPostsCreatedByUser.includes(postId)) {
            const result = await this.communityService.deletePost(postId);
            if (result.affected === 0) {
                throw new common_1.NotFoundException(`Could not find a post with id ${postId}`);
            }
            return { message: 'post deleted' };
        }
        else {
            throw new common_1.NotFoundException('This user has never written that post.');
        }
    }
    async getPostList(subCategoryId, query) {
        return await this.communityService.getPostList(subCategoryId, query);
    }
    async getPostDetail(postId, req) {
        try {
            const result = await this.communityService.getPostDetail(postId);
            if (req.user) {
                const { idsOfPostLikedByUser, idsOfPostsCreatedByUser } = req.user;
                result.isLogin = true;
                if (idsOfPostsCreatedByUser.includes(postId)) {
                    result.isAuthor = true;
                }
                else {
                    result.isAuthor = false;
                }
                if (idsOfPostLikedByUser.includes(postId)) {
                    result.ifLiked = true;
                }
                else {
                    result.ifLiked = false;
                }
                return result;
            }
            if (!req.user) {
                result.isLogin = false;
                return result;
            }
        }
        catch (err) {
            console.log(err);
            throw new Error(err);
        }
    }
    async createOrDeletePostLike(data, req) {
        try {
            const userId = req.user.id;
            const result = await this.communityService.createOrDeletePostLike(data, userId);
            if (result['raw']) {
                return { message: 'like deleted' };
            }
            else {
                return { message: 'like created' };
            }
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }
    async searchPost(query) {
        return await this.communityService.searchPost(query);
    }
    async createComment(body, req, postId) {
        const commentData = Object.assign({ userId: req.user.id, postId }, body);
        return await this.communityService.createComment(commentData);
    }
    async deleteComment(req, commentId) {
        const criteria = { userId: req.user.id, id: commentId };
        const result = await this.communityService.deleteComment(criteria);
        return result;
    }
    async updateComment(req, commentId, body) {
        const toUpdateContent = body.content;
        const criteria = {
            userId: req.user.id,
            id: commentId,
        };
        return await this.communityService.updateComment(criteria, toUpdateContent);
    }
    async getComments(req, postId) {
        const user = req.user;
        return await this.communityService.readComments(user, postId);
    }
    async createCommentLikes(req, commentId) {
        const criteria = {
            userId: req.user.id,
            commentId,
        };
        const result = await this.communityService.createCommentLikes(criteria);
        return result;
    }
};
__decorate([
    (0, common_1.Get)('/categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "getAllCategories", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('/post/image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "saveImageToS3", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Delete)('/post/image'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "deleteImageInS3", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('/post'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createPost_dto_1.CreatePostDto, Object]),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "createPost", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('/posts/update/:postId'),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "getPostToUpdate", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Put)('/posts/update/:postId'),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, createPost_dto_1.CreatePostDto, Object]),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "updatePost", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Delete)('/posts/:postId'),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "deletePost", null);
__decorate([
    (0, common_1.Get)('/posts/list/:subCategoryId'),
    __param(0, (0, common_1.Param)('subCategoryId', getPostList_pipe_1.ValidateSubCategoryIdPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, getPostList_dto_1.GetPostListDto]),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "getPostList", null);
__decorate([
    (0, common_1.UseGuards)(optionalGuard_1.OptionalAuthGuard),
    (0, common_1.Get)('/posts/:postId'),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "getPostDetail", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('/like'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "createOrDeletePostLike", null);
__decorate([
    (0, common_1.Get)('/search'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [searchPost_dto_1.SearchDto]),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "searchPost", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('/posts/:post_id/comment'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Param)('post_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [comment_dto_1.CreateCommentBodyDto, Object, Number]),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "createComment", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Delete)('/comments/:comment_id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('comment_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "deleteComment", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Put)('/comments/:comment_id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('comment_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, comment_dto_1.UpdateCommentBodyDto]),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "updateComment", null);
__decorate([
    (0, common_1.UseGuards)(optionalGuard_1.OptionalAuthGuard),
    (0, common_1.Get)('/posts/:post_id/comments'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('post_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "getComments", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('/comments/:comment_id/likes'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('comment_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "createCommentLikes", null);
CommunityController = __decorate([
    (0, common_1.Controller)('/community'),
    __metadata("design:paramtypes", [community_service_1.CommunityService])
], CommunityController);
exports.CommunityController = CommunityController;
//# sourceMappingURL=community.controller.js.map