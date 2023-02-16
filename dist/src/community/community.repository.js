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
exports.CommunityRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const SubCategory_1 = require("../entities/SubCategory");
const Post_1 = require("../entities/Post");
const PostLike_1 = require("../entities/PostLike");
const Comment_1 = require("../entities/Comment");
const CommentLike_1 = require("../entities/CommentLike");
let CommunityRepository = class CommunityRepository {
    constructor(subCategoryRepository, postRepository, postLikeRepository, commentRepository, commentLikeRepository) {
        this.subCategoryRepository = subCategoryRepository;
        this.postRepository = postRepository;
        this.postLikeRepository = postLikeRepository;
        this.commentRepository = commentRepository;
        this.commentLikeRepository = commentLikeRepository;
    }
    postList(offset, limit) {
        return this.postRepository
            .createQueryBuilder()
            .select([
            'post.id as postId',
            'post.title',
            'post.view',
            'DATE_FORMAT(post.created_at, "%Y-%m-%d") AS createdAt',
            'user.id as userId',
            'ranker_profile.name AS userName',
            'COUNT(DISTINCT post_like.id) AS postLike',
            'COUNT(DISTINCT comment.id) AS comment',
            'tier.name AS tierName',
            'tier.id AS tierId',
            'sub_category.name AS subCategoryName',
        ])
            .from(Post_1.Post, 'post')
            .leftJoin('post.user', 'user')
            .leftJoin('post.postLikes', 'post_like')
            .leftJoin('post.comments', 'comment')
            .leftJoin('user.rankerProfiles', 'ranker_profile')
            .leftJoin('ranker_profile.rankings', 'ranking')
            .leftJoin('ranking.tier', 'tier')
            .leftJoin('post.subCategory', 'sub_category')
            .groupBy('post.id')
            .addGroupBy('ranker_profile.name')
            .addGroupBy('tier.name')
            .addGroupBy('tier.id')
            .addGroupBy('ranker_profile.name')
            .addGroupBy('tier.name')
            .offset(offset)
            .limit(limit);
    }
    async getAllCategories() {
        const categories = await this.subCategoryRepository.find();
        return categories;
    }
    async createPost(title, userId, subCategoryId, contentUrl) {
        const result = await this.postRepository
            .createQueryBuilder()
            .insert()
            .into(Post_1.Post)
            .values({
            title: title,
            contentUrl: contentUrl,
            userId: userId,
            subCategoryId: subCategoryId,
        })
            .execute();
        return result;
    }
    async getPostById(postId) {
        return await this.postRepository.findOne({ where: { id: postId } });
    }
    async updatePost(postId, title, subCategoryId, contentUrl) {
        return await this.postRepository
            .createQueryBuilder()
            .update(Post_1.Post)
            .set({
            title: title,
            contentUrl: contentUrl,
            subCategoryId: subCategoryId,
        })
            .where('id = :id', { id: postId })
            .execute();
    }
    async deletePost(postId) {
        return await this.postRepository.delete({ id: postId });
    }
    async getPostList(subCategoryId, sort, date, offset, limit) {
        const queryBuilder = this.postList(offset, limit);
        queryBuilder.where('post.subCategoryId = :subCategoryId', {
            subCategoryId: subCategoryId,
        });
        if (sort === 'latest') {
            queryBuilder.orderBy('post.created_at', 'DESC');
        }
        if (sort === 'mostLiked' && date !== undefined) {
            if (date !== 'all') {
                queryBuilder
                    .orderBy('postLike', 'DESC')
                    .andWhere(`DATE_FORMAT(post.created_at, "%Y-%m-%d") >= DATE_SUB(NOW(), INTERVAL 1 ${date})`);
            }
            else if (date === 'all') {
                queryBuilder.orderBy('postLike', 'DESC');
            }
        }
        return await queryBuilder.getRawMany();
    }
    async getPostDatail(postId) {
        const postContent = await this.postRepository
            .createQueryBuilder('post')
            .select('post.content_url AS contentUrl')
            .where('post.id = :postId', { postId: postId })
            .getRawOne();
        const postDetail = await this.postRepository
            .createQueryBuilder('post')
            .leftJoin('user', 'user', 'user.id = post.user_id')
            .leftJoin('ranker_profile', 'ranker_profile', 'ranker_profile.user_id = user.id')
            .leftJoin('sub_category', 'sub_category', 'post.sub_category_id = sub_category.id')
            .leftJoin('post_like', 'post_like', 'post_like.post_id = post.id')
            .leftJoin('ranking', 'ranking', 'ranking.ranker_profile_id = ranker_profile.id')
            .leftJoin('tier', 'tier', 'tier.id = ranking.tier_id')
            .select([
            'post.title AS postTitle',
            'post.id AS postId',
            'post.user_id AS userId',
            'ranker_profile.name AS userName',
            'ranker_profile.profile_image_url AS userProfileImage',
            'tier.id AS tierId',
            'tier.name AS tierName',
            'post.sub_category_id AS subCategoryId',
            'sub_category.name AS subCategoryName',
            "DATE_FORMAT(post.created_at, '%Y-%m-%d %H:%i:%s') AS createdAt",
        ])
            .addSelect(`(SELECT JSON_ARRAYAGG(JSON_OBJECT("likeId", post_like.id, "userId", post_like.user_id, "createdAt", post_like.created_at))
      from post_like where post_like.post_id = post.id) as likes`)
            .where('post.id = :id', { id: postId })
            .getRawOne();
        postDetail.content = postContent.contentUrl;
        return postDetail;
    }
    async getPostsCreatedByUser(userId) {
        return this.postRepository
            .createQueryBuilder()
            .select([
            'post.id as id',
            'post.title as title',
            'sub_category.name as subCategory',
            `DATE_FORMAT(post.created_at, '%Y-%m-%d %H:%i:%s') as createdAt`,
        ])
            .addSelect((subQuery) => {
            return subQuery
                .select('COUNT(post_like.id)', 'likeNumber')
                .from(PostLike_1.PostLike, 'post_like')
                .where('post_like.post_id = post.id');
        }, 'likeNumber')
            .addSelect((subQuery) => {
            return subQuery
                .select('COUNT(comment.post_id)', 'commentNumber')
                .from(Comment_1.Comment, 'comment')
                .where('post.id = comment.post_id');
        }, 'commentNumber')
            .leftJoin('sub_category', 'sub_category', 'sub_category.id = post.sub_category_id')
            .where('post.user_id = :userId', { userId: userId })
            .groupBy('post.id')
            .getRawMany();
    }
    async createOrDeletePostLike(postId, userId) {
        const ifLiked = await this.postLikeRepository.findOne({
            where: { postId: postId, userId: userId },
        });
        if (!ifLiked) {
            try {
                const postLike = new PostLike_1.PostLike();
                postLike.postId = postId;
                postLike.userId = userId;
                return await this.postLikeRepository.save(postLike);
            }
            catch (err) {
                throw new common_1.HttpException('Error: invaild postId', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        else if (ifLiked) {
            return await this.postLikeRepository.delete({ id: ifLiked.id });
        }
    }
    async searchPost(option, keyword, offset, limit) {
        const queryBuilder = this.postList(offset, limit);
        if (option === 'title') {
            queryBuilder.where('post.title LIKE :keyword', {
                keyword: `%${keyword}%`,
            });
        }
        return await queryBuilder.getRawMany();
    }
    async getIdsOfPostLikedByUser(userId) {
        return this.postLikeRepository
            .createQueryBuilder()
            .select(['post_id'])
            .where('user_id = :userId', { userId: userId })
            .getRawMany();
    }
    async createComment(commentData) {
        const data = this.commentRepository.create(commentData);
        return await this.commentRepository.save(data);
    }
    async deleteComment(criteria) {
        return await this.commentRepository.delete(criteria);
    }
    async updateComment(criteria, toUpdateContent) {
        return await this.commentRepository
            .createQueryBuilder()
            .update(Comment_1.Comment)
            .set({
            content: toUpdateContent,
        })
            .where(`id = ${criteria.id} AND user_id = ${criteria.userId}`)
            .execute();
    }
    async isCommentExist(commentId) {
        return await this.commentRepository.exist({ where: { id: commentId } });
    }
    async readComments(postId, depth) {
        return await this.commentRepository
            .createQueryBuilder()
            .select([
            'comment.user_id as userId',
            'comment.group_order as groupOrder',
            'comment.id as commentId',
            'ranker_profile.name as userName',
            'ranker_profile.profile_image_url as profileImageUrl',
            'comment.content as content',
            'tier.name as tier',
            'comment.depth as depth',
            `DATE_FORMAT(comment.created_at, '%Y-%m-%d %H:%i:%s') as createdAt`,
            `DATE_FORMAT(comment.updated_at, '%Y-%m-%d %H:%i:%s') as updatedAt`,
        ])
            .addSelect((subQuery) => {
            return subQuery
                .select('COUNT(comment_like.id)', 'likeNumber')
                .from(CommentLike_1.CommentLike, 'comment_like')
                .where('comment.id = comment_like.comment_id');
        }, 'likeNumber')
            .leftJoin('user', 'user', 'comment.user_id = user.id')
            .leftJoin('ranker_profile', 'ranker_profile', 'user.id = ranker_profile.user_id')
            .leftJoin('ranking', 'ranking', 'ranking.ranker_profile_id = ranker_profile.id')
            .leftJoin('tier', 'tier', 'ranking.tier_id = tier.id')
            .where('comment.post_id = :postId AND comment.depth = :depth', {
            postId: postId,
            depth: depth,
        })
            .orderBy('comment.group_order', 'ASC')
            .addOrderBy('comment.created_at', 'ASC')
            .getRawMany();
    }
    async createCommentLikes(criteria) {
        const isExist = await this.commentLikeRepository.exist({
            where: { userId: criteria.userId, commentId: criteria.commentId },
        });
        if (!isExist)
            return await this.commentLikeRepository.save(criteria);
        return await this.commentLikeRepository.delete(criteria);
    }
    async getCommentsCreatedByUser(userId) {
        return this.commentRepository
            .createQueryBuilder()
            .select(['id', 'content', 'post_id as postId', 'created_at as createdAt'])
            .where('user_id = :userId', { userId: userId })
            .getRawMany();
    }
    async getIdsOfCommentLikedByUser(userId) {
        return this.commentLikeRepository
            .createQueryBuilder()
            .select(['comment_id'])
            .where('user_id = :userId', { userId: userId })
            .getRawMany();
    }
};
CommunityRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(SubCategory_1.SubCategory)),
    __param(1, (0, typeorm_1.InjectRepository)(Post_1.Post)),
    __param(2, (0, typeorm_1.InjectRepository)(PostLike_1.PostLike)),
    __param(3, (0, typeorm_1.InjectRepository)(Comment_1.Comment)),
    __param(4, (0, typeorm_1.InjectRepository)(CommentLike_1.CommentLike)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CommunityRepository);
exports.CommunityRepository = CommunityRepository;
//# sourceMappingURL=community.repository.js.map