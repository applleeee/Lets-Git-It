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
exports.AuthRepository = void 0;
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const Career_1 = require("../entities/Career");
const Field_1 = require("../entities/Field");
let AuthRepository = class AuthRepository {
    constructor(careerRepository, fieldRepository) {
        this.careerRepository = careerRepository;
        this.fieldRepository = fieldRepository;
    }
    async getAuthCategory() {
        const data = {
            field: await this.fieldRepository.find(),
            career: await this.careerRepository.find(),
        };
        return data;
    }
};
AuthRepository = __decorate([
    __param(0, (0, typeorm_2.InjectRepository)(Career_1.Career)),
    __param(1, (0, typeorm_2.InjectRepository)(Field_1.Field)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository])
], AuthRepository);
exports.AuthRepository = AuthRepository;
//# sourceMappingURL=auth.repository.js.map