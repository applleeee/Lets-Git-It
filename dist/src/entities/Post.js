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
exports.Post = void 0;
const typeorm_1 = require("typeorm");
const Comment_1 = require("./Comment");
const User_1 = require("./User");
const SubCategory_1 = require("./SubCategory");
const PostLike_1 = require("./PostLike");
let Post = class Post {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', name: 'id', unsigned: true }),
    __metadata("design:type", Number)
], Post.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'title', nullable: false, length: 500 }),
    __metadata("design:type", String)
], Post.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'content_url', nullable: false, length: 2083 }),
    __metadata("design:type", String)
], Post.prototype, "contentUrl", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'view', nullable: false, default: () => "'0'" }),
    __metadata("design:type", Number)
], Post.prototype, "view", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'user_id', nullable: false, unsigned: true }),
    __metadata("design:type", Number)
], Post.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', {
        name: 'sub_category_id',
        nullable: false,
        unsigned: true,
    }),
    __metadata("design:type", Number)
], Post.prototype, "subCategoryId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', nullable: false }),
    __metadata("design:type", Date)
], Post.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', nullable: true }),
    __metadata("design:type", Date)
], Post.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Comment_1.Comment, (comment) => comment.post),
    __metadata("design:type", Array)
], Post.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.posts, {
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'user_id', referencedColumnName: 'id' }]),
    __metadata("design:type", User_1.User)
], Post.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => SubCategory_1.SubCategory, (subCategory) => subCategory.posts, {
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'sub_category_id', referencedColumnName: 'id' }]),
    __metadata("design:type", SubCategory_1.SubCategory)
], Post.prototype, "subCategory", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PostLike_1.PostLike, (postLike) => postLike.post),
    __metadata("design:type", Array)
], Post.prototype, "postLikes", void 0);
Post = __decorate([
    (0, typeorm_1.Index)('user_id', ['userId'], {}),
    (0, typeorm_1.Entity)('post', { schema: 'git_rank' })
], Post);
exports.Post = Post;
//# sourceMappingURL=Post.js.map