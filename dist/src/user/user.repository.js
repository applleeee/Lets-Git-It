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
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const User_1 = require("../entities/User");
const typeorm_2 = require("@nestjs/typeorm");
let UserRepository = class UserRepository {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async getByGithubId(githubId) {
        return await this.userRepository.findOneBy({
            githubId,
        });
    }
    async getUserIdByGithubId(githubId) {
        const user = await this.userRepository.findOneBy({
            githubId,
        });
        return user.id;
    }
    async getByUserId(id) {
        return await this.userRepository.findOneBy({
            id,
        });
    }
    async createUser(signUpData) {
        const user = await this.userRepository.create(signUpData);
        await this.userRepository.save(user);
    }
    async updateMyPage(userId, partialEntity) {
        await this.userRepository.update({ id: userId }, partialEntity);
    }
};
UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(User_1.User)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], UserRepository);
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map