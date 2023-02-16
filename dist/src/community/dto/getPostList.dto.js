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
exports.GetPostListDto = exports.DateEnum = exports.SortEnum = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
var SortEnum;
(function (SortEnum) {
    SortEnum["latest"] = "latest";
    SortEnum["mostLiked"] = "mostLiked";
})(SortEnum = exports.SortEnum || (exports.SortEnum = {}));
var DateEnum;
(function (DateEnum) {
    DateEnum["all"] = "all";
    DateEnum["year"] = "year";
    DateEnum["month"] = "month";
    DateEnum["week"] = "week";
    DateEnum["day"] = "day";
})(DateEnum = exports.DateEnum || (exports.DateEnum = {}));
class GetPostListDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(SortEnum),
    __metadata("design:type", String)
], GetPostListDto.prototype, "sort", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(DateEnum),
    __metadata("design:type", String)
], GetPostListDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], GetPostListDto.prototype, "offset", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], GetPostListDto.prototype, "limit", void 0);
exports.GetPostListDto = GetPostListDto;
//# sourceMappingURL=getPostList.dto.js.map