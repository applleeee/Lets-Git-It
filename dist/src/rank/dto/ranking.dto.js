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
exports.TotalScoresOutput = exports.LangOutput = exports.AvgValuesOutput = exports.MaxValuesOutput = void 0;
const class_validator_1 = require("class-validator");
class MaxValuesOutput {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MaxValuesOutput.prototype, "maxCuriosityScore", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MaxValuesOutput.prototype, "maxPassionScore", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MaxValuesOutput.prototype, "maxFameScore", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MaxValuesOutput.prototype, "maxAbilityScore", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MaxValuesOutput.prototype, "maxTotalScore", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], MaxValuesOutput.prototype, "maxIssueNumber", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], MaxValuesOutput.prototype, "maxForkingNumber", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], MaxValuesOutput.prototype, "maxStarringNumber", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], MaxValuesOutput.prototype, "maxFollowingNumber", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], MaxValuesOutput.prototype, "maxCommitNumber", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], MaxValuesOutput.prototype, "maxPRNumber", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], MaxValuesOutput.prototype, "maxReviewNumber", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], MaxValuesOutput.prototype, "maxPersonalRepoNumber", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], MaxValuesOutput.prototype, "maxFollowerNumber", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], MaxValuesOutput.prototype, "maxForkedNumber", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], MaxValuesOutput.prototype, "maxWatchedNumber", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], MaxValuesOutput.prototype, "maxSponsorNumber", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], MaxValuesOutput.prototype, "maxContributingRepoStarNumber", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], MaxValuesOutput.prototype, "maxMyStartNumber", void 0);
exports.MaxValuesOutput = MaxValuesOutput;
class AvgValuesOutput {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AvgValuesOutput.prototype, "avgCuriosityScore", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AvgValuesOutput.prototype, "avgPassionScore", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AvgValuesOutput.prototype, "avgFameScore", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AvgValuesOutput.prototype, "avgAbilityScore", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AvgValuesOutput.prototype, "avgTotalScore", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AvgValuesOutput.prototype, "avgIssueNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AvgValuesOutput.prototype, "avgForkingNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AvgValuesOutput.prototype, "avgStarringNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AvgValuesOutput.prototype, "avgFollowingNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AvgValuesOutput.prototype, "avgCommitNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AvgValuesOutput.prototype, "avgPRNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AvgValuesOutput.prototype, "avgReviewNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AvgValuesOutput.prototype, "avgPersonalRepoNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AvgValuesOutput.prototype, "avgFollowerNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AvgValuesOutput.prototype, "avgForkedNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AvgValuesOutput.prototype, "avgWatchedNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AvgValuesOutput.prototype, "avgSponsorNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AvgValuesOutput.prototype, "avgContributingRepoStarNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AvgValuesOutput.prototype, "avgMyStartNumber", void 0);
exports.AvgValuesOutput = AvgValuesOutput;
class LangOutput {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LangOutput.prototype, "main_language", void 0);
exports.LangOutput = LangOutput;
class TotalScoresOutput {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TotalScoresOutput.prototype, "total_score", void 0);
exports.TotalScoresOutput = TotalScoresOutput;
//# sourceMappingURL=ranking.dto.js.map