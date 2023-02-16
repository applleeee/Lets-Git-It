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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const Comment_1 = require("./Comment");
const CommentLike_1 = require("./CommentLike");
const Post_1 = require("./Post");
const PostLike_1 = require("./PostLike");
const RankerProfile_1 = require("./RankerProfile");
const Field_1 = require("./Field");
const Career_1 = require("./Career");
const boolean_transformer_1 = require("../utiles/boolean-transformer");
let User = class User {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', name: 'id', unsigned: true }),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'github_id', nullable: false, unsigned: true }),
    __metadata("design:type", Number)
], User.prototype, "githubId", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { name: 'field_id', nullable: false, unsigned: true }),
    __metadata("design:type", Number)
], User.prototype, "fieldId", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { name: 'career_id', nullable: false, unsigned: true }),
    __metadata("design:type", Number)
], User.prototype, "careerId", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', {
        name: 'is_korean',
        nullable: true,
        width: 1,
        transformer: new boolean_transformer_1.BooleanTransformer(),
    }),
    __metadata("design:type", Boolean)
], User.prototype, "isKorean", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', {
        name: 'is_admin',
        nullable: true,
        transformer: new boolean_transformer_1.BooleanTransformer(),
        width: 1,
        default: () => "'0'",
    }),
    __metadata("design:type", Boolean)
], User.prototype, "isAdmin", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp', { name: 'created_at', default: () => "'now()'" }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp', { name: 'updated_at', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Comment_1.Comment, (comment) => comment.user),
    __metadata("design:type", Array)
], User.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CommentLike_1.CommentLike, (commentLike) => commentLike.user),
    __metadata("design:type", Array)
], User.prototype, "commentLikes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Post_1.Post, (post) => post.user),
    __metadata("design:type", Array)
], User.prototype, "posts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PostLike_1.PostLike, (postLike) => postLike.user),
    __metadata("design:type", Array)
], User.prototype, "postLikes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => RankerProfile_1.RankerProfile, (rankerProfile) => rankerProfile.user),
    __metadata("design:type", Array)
], User.prototype, "rankerProfiles", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Field_1.Field, (field) => field.users, {
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'field_id', referencedColumnName: 'id' }]),
    __metadata("design:type", Field_1.Field)
], User.prototype, "field", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Career_1.Career, (career) => career.users, {
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'career_id', referencedColumnName: 'id' }]),
    __metadata("design:type", Career_1.Career)
], User.prototype, "career", void 0);
User = __decorate([
    (0, typeorm_1.Index)('field_id', ['fieldId'], {}),
    (0, typeorm_1.Unique)(['githubId']),
    (0, typeorm_1.Entity)('user', { schema: 'git_rank' })
], User);
exports.User = User;
//# sourceMappingURL=User.js.map