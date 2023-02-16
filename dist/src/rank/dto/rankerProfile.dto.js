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
exports.RankerProfileOutput = exports.Top100 = exports.Top5 = exports.SearchOutput = void 0;
const class_validator_1 = require("class-validator");
class SearchOutput {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchOutput.prototype, "rankerName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchOutput.prototype, "profileImage", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchOutput.prototype, "tierImage", void 0);
exports.SearchOutput = SearchOutput;
class Top5 extends SearchOutput {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Top5.prototype, "totalScore", void 0);
exports.Top5 = Top5;
class Top100 extends Top5 {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Top100.prototype, "mainLang", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Top100.prototype, "followerNumber", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Top100.prototype, "myStarNumber", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Top100.prototype, "commitNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Top100.prototype, "totalScore", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Top100.prototype, "tier", void 0);
exports.Top100 = Top100;
class RankerProfileOutput {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RankerProfileOutput.prototype, "rankerId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RankerProfileOutput.prototype, "rankerName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RankerProfileOutput.prototype, "profileImage", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RankerProfileOutput.prototype, "blog", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RankerProfileOutput.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RankerProfileOutput.prototype, "company", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RankerProfileOutput.prototype, "region", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RankerProfileOutput.prototype, "mainLang", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RankerProfileOutput.prototype, "curiosityScore", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RankerProfileOutput.prototype, "passionScore", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RankerProfileOutput.prototype, "fameScore", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RankerProfileOutput.prototype, "abilityScore", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RankerProfileOutput.prototype, "totalScore", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RankerProfileOutput.prototype, "issueNumber", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RankerProfileOutput.prototype, "forkingNumber", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RankerProfileOutput.prototype, "starringNumber", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RankerProfileOutput.prototype, "followingNumber", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RankerProfileOutput.prototype, "commitNumber", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RankerProfileOutput.prototype, "prNumber", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RankerProfileOutput.prototype, "reviewNumber", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RankerProfileOutput.prototype, "personalRepoNumber", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RankerProfileOutput.prototype, "followerNumber", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RankerProfileOutput.prototype, "forkedNumber", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RankerProfileOutput.prototype, "watchedNumber", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RankerProfileOutput.prototype, "sponsorNumber", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RankerProfileOutput.prototype, "contributingRepoStarNumber", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RankerProfileOutput.prototype, "myStarNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RankerProfileOutput.prototype, "tier", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RankerProfileOutput.prototype, "tierImage", void 0);
exports.RankerProfileOutput = RankerProfileOutput;
//# sourceMappingURL=rankerProfile.dto.js.map