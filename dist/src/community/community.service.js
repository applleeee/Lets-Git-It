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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityService = void 0;
const common_1 = require("@nestjs/common");
const community_repository_1 = require("./community.repository");
const aws_1 = require("../utiles/aws");
let CommunityService = class CommunityService {
    constructor(CommunityRepository) {
        this.CommunityRepository = CommunityRepository;
    }
    getCurrentTime() {
        return new Date(+new Date() + 3240 * 10000)
            .toISOString()
            .replace('T', '_')
            .replace(/\..*/, '')
            .replace(/\:/g, '-');
    }
    async getAllCategories() {
        const categories = this.CommunityRepository.getAllCategories();
        return categories;
    }
    async saveImageToS3(image, userId) {
        const now = this.getCurrentTime();
        const name = `post_images/${userId}_${now}`;
        const mimetype = image.mimetype;
        const saveToS3 = await (0, aws_1.uploadToS3)(image.buffer, name, mimetype);
        return saveToS3.Location;
    }
    async deleteImageInS3(toDeleteImageData) {
        const { toDeleteImage } = toDeleteImageData;
        if (toDeleteImage.length !== 0) {
            return await (0, aws_1.deleteS3Data)(toDeleteImage);
        }
        return { message: 'No image to delete' };
    }
    async createPost(postData, userId) {
        const now = this.getCurrentTime();
        const { title, subCategoryId, content } = postData;
        const contentUrl = `post/${userId}_${title}_${now}`;
        const mimetype = 'string';
        await (0, aws_1.uploadToS3)(content, contentUrl, mimetype);
        await this.CommunityRepository.createPost(title, userId, subCategoryId, contentUrl);
    }
    async getPostToUpdate(postId) {
        const postDetail = await this.CommunityRepository.getPostById(postId);
        const postContent = await (0, aws_1.getS3Data)(postDetail.contentUrl);
        postDetail['content'] = postContent;
        delete postDetail.contentUrl;
        return postDetail;
    }
    async updatePost(postId, updatedData, userId) {
        const originPost = await this.CommunityRepository.getPostById(postId);
        try {
            await (0, aws_1.deleteS3Data)([originPost.contentUrl]);
        }
        catch (err) {
            console.log(err);
            throw new Error(err);
        }
        const now = this.getCurrentTime();
        const { title, subCategoryId, content } = updatedData;
        const contentUrl = `post/${userId}_${title}_${now}`;
        const mimetype = 'string';
        try {
            await (0, aws_1.uploadToS3)(content, contentUrl, mimetype);
        }
        catch (err) {
            console.log(err);
            throw new Error(err);
        }
        await this.CommunityRepository.updatePost(postId, title, subCategoryId, contentUrl);
    }
    async deletePost(postId) {
        const originPost = await this.CommunityRepository.getPostById(postId);
        await (0, aws_1.deleteS3Data)([originPost.contentUrl]);
        return await this.CommunityRepository.deletePost(postId);
    }
    async getPostList(subCategoryId, query) {
        const { sort, date, offset, limit } = query;
        const result = await this.CommunityRepository.getPostList(subCategoryId, sort, date, offset, limit);
        result['total'] = result.length;
        return result;
    }
    async getPostDetail(postId) {
        const postDetail = await this.CommunityRepository.getPostDatail(postId);
        const postContent = await (0, aws_1.getS3Data)(postDetail.content);
        postDetail.content = postContent;
        return postDetail;
    }
    async getIdsOfPostsCreatedByUser(userId) {
        const data = await this.CommunityRepository.getPostsCreatedByUser(userId);
        return data.map((item) => Object.values(item)[0]);
    }
    async getIdsOfPostLikedByUser(userId) {
        const data = await this.CommunityRepository.getIdsOfPostLikedByUser(userId);
        return data.map((item) => Object.values(item)[0]);
    }
    async createOrDeletePostLike(data, userId) {
        const { postId } = data;
        return await this.CommunityRepository.createOrDeletePostLike(postId, userId);
    }
    async searchPost(query) {
        const { option, keyword, offset, limit } = query;
        return await this.CommunityRepository.searchPost(option, keyword, offset, limit);
    }
    async createComment(commentData) {
        return await this.CommunityRepository.createComment(commentData);
    }
    async deleteComment(criteria) {
        return await this.CommunityRepository.deleteComment(criteria);
    }
    async updateComment(criteria, toUpdateContent) {
        const isCommentExist = await this.CommunityRepository.isCommentExist(criteria.id);
        if (!isCommentExist)
            throw new common_1.HttpException('THE_COMMENT_IS_NOT_EXIST', common_1.HttpStatus.BAD_REQUEST);
        return await this.CommunityRepository.updateComment(criteria, toUpdateContent);
    }
    async readComments(user, postId) {
        let depth;
        (function (depth) {
            depth[depth["COMMENT"] = 1] = "COMMENT";
            depth[depth["RE_COMMENT"] = 2] = "RE_COMMENT";
        })(depth || (depth = {}));
        const comments = await this.CommunityRepository.readComments(postId, depth.COMMENT);
        const reComments = await this.CommunityRepository.readComments(postId, depth.RE_COMMENT);
        comments.map((comment) => {
            comment.isCreatedByUser =
                user.idsOfCommentsCreatedByUser.indexOf(comment.commentId) >= 0
                    ? true
                    : false;
            comment.isLikedByUser =
                user.idsOfCommentLikedByUser.indexOf(comment.commentId) >= 0
                    ? true
                    : false;
        });
        reComments.map((reComment) => {
            reComment.isCreatedByUser =
                user.idsOfCommentsCreatedByUser.indexOf(reComment.commentId) >= 0
                    ? true
                    : false;
            reComment.isLikedByUser =
                user.idsOfCommentLikedByUser.indexOf(reComment.commentId) >= 0
                    ? true
                    : false;
        });
        comments.map((comment) => {
            return (comment.reComments = reComments.filter((reComment) => {
                return reComment['groupOrder'] === comment['groupOrder'];
            }));
        });
        return comments;
    }
    async createCommentLikes(criteria) {
        return await this.CommunityRepository.createCommentLikes(criteria);
    }
    async getIdsOfCommentCreatedByUser(userId) {
        const data = await this.CommunityRepository.getCommentsCreatedByUser(userId);
        return data.map((item) => Object.values(item)[0]);
    }
    async getIdsOfCommentLikedByUser(userId) {
        const data = await this.CommunityRepository.getIdsOfCommentLikedByUser(userId);
        return data.map((item) => Object.values(item)[0]);
    }
};
CommunityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [community_repository_1.CommunityRepository])
], CommunityService);
exports.CommunityService = CommunityService;
//# sourceMappingURL=community.service.js.map