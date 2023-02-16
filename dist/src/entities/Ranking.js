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
exports.Ranking = void 0;
const typeorm_1 = require("typeorm");
const RankerProfile_1 = require("./RankerProfile");
const Tier_1 = require("./Tier");
let Ranking = class Ranking {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', name: 'id', unsigned: true }),
    __metadata("design:type", Number)
], Ranking.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'main_language', length: 255 }),
    __metadata("design:type", String)
], Ranking.prototype, "mainLanguage", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { name: 'curiosity_score', precision: 8, scale: 4 }),
    __metadata("design:type", Number)
], Ranking.prototype, "curiosityScore", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { name: 'passion_score', precision: 8, scale: 4 }),
    __metadata("design:type", Number)
], Ranking.prototype, "passionScore", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { name: 'fame_score', precision: 8, scale: 4 }),
    __metadata("design:type", Number)
], Ranking.prototype, "fameScore", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { name: 'ability_score', precision: 8, scale: 4 }),
    __metadata("design:type", Number)
], Ranking.prototype, "abilityScore", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { name: 'total_score', precision: 9, scale: 4 }),
    __metadata("design:type", Number)
], Ranking.prototype, "totalScore", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'curiosity_raise_issue_number', unsigned: true }),
    __metadata("design:type", Number)
], Ranking.prototype, "curiosityRaiseIssueNumber", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'curiosity_fork_repository_number', unsigned: true }),
    __metadata("design:type", Number)
], Ranking.prototype, "curiosityForkRepositoryNumber", void 0);
__decorate([
    (0, typeorm_1.Column)('int', {
        name: 'curiosity_give_star_repository_number',
        unsigned: true,
    }),
    __metadata("design:type", Number)
], Ranking.prototype, "curiosityGiveStarRepositoryNumber", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'curiosity_following_number', unsigned: true }),
    __metadata("design:type", Number)
], Ranking.prototype, "curiosityFollowingNumber", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'passion_commit_number', unsigned: true }),
    __metadata("design:type", Number)
], Ranking.prototype, "passionCommitNumber", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'passion_pr_number', unsigned: true }),
    __metadata("design:type", Number)
], Ranking.prototype, "passionPrNumber", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'passion_review_number', unsigned: true }),
    __metadata("design:type", Number)
], Ranking.prototype, "passionReviewNumber", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'passion_create_repository_number', unsigned: true }),
    __metadata("design:type", Number)
], Ranking.prototype, "passionCreateRepositoryNumber", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'fame_follower_number', unsigned: true }),
    __metadata("design:type", Number)
], Ranking.prototype, "fameFollowerNumber", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'fame_repository_forked_number', unsigned: true }),
    __metadata("design:type", Number)
], Ranking.prototype, "fameRepositoryForkedNumber", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'fame_repository_watched_number', unsigned: true }),
    __metadata("design:type", Number)
], Ranking.prototype, "fameRepositoryWatchedNumber", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'ability_sponsered_number', unsigned: true }),
    __metadata("design:type", Number)
], Ranking.prototype, "abilitySponseredNumber", void 0);
__decorate([
    (0, typeorm_1.Column)('int', {
        name: 'ability_contribute_repository_star_number',
        unsigned: true,
    }),
    __metadata("design:type", Number)
], Ranking.prototype, "abilityContributeRepositoryStarNumber", void 0);
__decorate([
    (0, typeorm_1.Column)('int', {
        name: 'ability_public_repository_star_number',
        unsigned: true,
    }),
    __metadata("design:type", Number)
], Ranking.prototype, "abilityPublicRepositoryStarNumber", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'ranker_profile_id', nullable: true, unsigned: true }),
    __metadata("design:type", Number)
], Ranking.prototype, "rankerProfileId", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', { name: 'tier_id', nullable: true, unsigned: true }),
    __metadata("design:type", Number)
], Ranking.prototype, "tierId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => RankerProfile_1.RankerProfile, (rankerProfile) => rankerProfile.rankings, {
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'ranker_profile_id', referencedColumnName: 'id' }]),
    __metadata("design:type", RankerProfile_1.RankerProfile)
], Ranking.prototype, "rankerProfile", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tier_1.Tier, (tier) => tier.rankings, {
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'tier_id', referencedColumnName: 'id' }]),
    __metadata("design:type", Tier_1.Tier)
], Ranking.prototype, "tier", void 0);
Ranking = __decorate([
    (0, typeorm_1.Index)('ranker_profile_id', ['rankerProfileId'], {}),
    (0, typeorm_1.Entity)('ranking', { schema: 'git_rank' })
], Ranking);
exports.Ranking = Ranking;
//# sourceMappingURL=Ranking.js.map