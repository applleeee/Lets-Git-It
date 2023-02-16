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
exports.AuthorizedUser = exports.SignUpWithUserNameDto = exports.SignUpDto = exports.GithubCodeDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class GithubCodeDto {
}
__decorate([
    (0, class_validator_1.IsString)({ message: 'BAD_GITHUB_CODE' }),
    __metadata("design:type", String)
], GithubCodeDto.prototype, "code", void 0);
exports.GithubCodeDto = GithubCodeDto;
class SignUpDto {
}
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SignUpDto.prototype, "githubId", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SignUpDto.prototype, "fieldId", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SignUpDto.prototype, "careerId", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Boolean),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SignUpDto.prototype, "isKorean", void 0);
exports.SignUpDto = SignUpDto;
class SignUpWithUserNameDto extends SignUpDto {
}
__decorate([
    (0, class_transformer_1.Type)(() => String),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignUpWithUserNameDto.prototype, "userName", void 0);
exports.SignUpWithUserNameDto = SignUpWithUserNameDto;
class AuthorizedUser {
}
exports.AuthorizedUser = AuthorizedUser;
//# sourceMappingURL=auth.dto.js.map