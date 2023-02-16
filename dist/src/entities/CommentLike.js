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
exports.CommentLike = void 0;
const typeorm_1 = require("typeorm");
const Comment_1 = require("./Comment");
const User_1 = require("./User");
let CommentLike = class CommentLike {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', name: 'id', unsigned: true }),
    __metadata("design:type", Number)
], CommentLike.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'comment_id', nullable: false, unsigned: true }),
    __metadata("design:type", Number)
], CommentLike.prototype, "commentId", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'user_id', nullable: false, unsigned: true }),
    __metadata("design:type", Number)
], CommentLike.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', nullable: false }),
    __metadata("design:type", Date)
], CommentLike.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', nullable: true }),
    __metadata("design:type", Date)
], CommentLike.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Comment_1.Comment, (comment) => comment.commentLikes, {
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'comment_id', referencedColumnName: 'id' }]),
    __metadata("design:type", Comment_1.Comment)
], CommentLike.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.commentLikes, {
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'user_id', referencedColumnName: 'id' }]),
    __metadata("design:type", User_1.User)
], CommentLike.prototype, "user", void 0);
CommentLike = __decorate([
    (0, typeorm_1.Index)('comment_id', ['commentId'], {}),
    (0, typeorm_1.Entity)('comment_like', { schema: 'git_rank' })
], CommentLike);
exports.CommentLike = CommentLike;
//# sourceMappingURL=CommentLike.js.map