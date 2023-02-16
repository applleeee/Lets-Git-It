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
exports.RankerProfile = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Ranking_1 = require("./Ranking");
let RankerProfile = class RankerProfile {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', name: 'id', unsigned: true }),
    __metadata("design:type", Number)
], RankerProfile.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'name', length: 200 }),
    __metadata("design:type", String)
], RankerProfile.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'profile_image_url',
        nullable: true,
        length: 2083,
    }),
    __metadata("design:type", String)
], RankerProfile.prototype, "profileImageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'profile_text', nullable: true, length: 500 }),
    __metadata("design:type", String)
], RankerProfile.prototype, "profileText", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'homepage_url', nullable: true, length: 2083 }),
    __metadata("design:type", String)
], RankerProfile.prototype, "homepageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'email', nullable: true, length: 255 }),
    __metadata("design:type", String)
], RankerProfile.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'company', nullable: true, length: 255 }),
    __metadata("design:type", String)
], RankerProfile.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'region', nullable: true, length: 255 }),
    __metadata("design:type", String)
], RankerProfile.prototype, "region", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'user_id', nullable: true, unsigned: true }),
    __metadata("design:type", Number)
], RankerProfile.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', nullable: false }),
    __metadata("design:type", Date)
], RankerProfile.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', nullable: true }),
    __metadata("design:type", Date)
], RankerProfile.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.rankerProfiles, {
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'user_id', referencedColumnName: 'id' }]),
    __metadata("design:type", User_1.User)
], RankerProfile.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Ranking_1.Ranking, (ranking) => ranking.rankerProfile),
    __metadata("design:type", Array)
], RankerProfile.prototype, "rankings", void 0);
RankerProfile = __decorate([
    (0, typeorm_1.Index)('user_id', ['userId'], {}),
    (0, typeorm_1.Entity)('ranker_profile', { schema: 'git_rank' })
], RankerProfile);
exports.RankerProfile = RankerProfile;
//# sourceMappingURL=RankerProfile.js.map