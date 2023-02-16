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
exports.UserService = void 0;
const rankerProfile_repository_1 = require("./../rank/rankerProfile.repository");
const common_1 = require("@nestjs/common");
const user_repository_1 = require("./user.repository");
const rxjs_1 = require("rxjs");
const dotenv = require("dotenv");
const axios_1 = require("@nestjs/axios");
const community_repository_1 = require("../community/community.repository");
dotenv.config();
let UserService = class UserService {
    constructor(http, userRepository, rankerProfileRepository, communityRepository) {
        this.http = http;
        this.userRepository = userRepository;
        this.rankerProfileRepository = rankerProfileRepository;
        this.communityRepository = communityRepository;
    }
    async getByGithubId(githubId) {
        return await this.userRepository.getByGithubId(githubId);
    }
    async getById(id) {
        return await this.userRepository.getByUserId(id);
    }
    async getGithubAccessToken(code) {
        const requestBody = {
            code,
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRETS,
        };
        const config = {
            headers: {
                accept: 'application/json',
            },
        };
        return await (0, rxjs_1.lastValueFrom)(this.http
            .post(`https://github.com/login/oauth/access_token`, requestBody, config)
            .pipe((0, rxjs_1.map)((res) => { var _a; return (_a = res.data) === null || _a === void 0 ? void 0 : _a.access_token; })));
    }
    async getByGithubAccessToken(githubAccessToken) {
        const config = {
            headers: {
                accept: 'application/json',
                Authorization: `token ${githubAccessToken}`,
            },
        };
        return await (0, rxjs_1.lastValueFrom)(this.http
            .get(`https://api.github.com/user`, config)
            .pipe((0, rxjs_1.map)((res) => res.data)));
    }
    async createUser(signUpData) {
        await this.userRepository.createUser(signUpData);
    }
    async getMyPage(userId) {
        const [user] = await this.rankerProfileRepository.getMyPage(userId);
        const { name, profileText, profileImageUrl, email } = user;
        const { careerId, fieldId, isKorean } = await this.userRepository.getByUserId(userId);
        const posts = await this.communityRepository.getPostsCreatedByUser(userId);
        const result = {
            userName: name,
            profileText,
            profileImageUrl,
            email,
            careerId,
            fieldId,
            isKorean,
            posts,
        };
        return result;
    }
    async updateMyPage(userId, partialEntity) {
        await this.userRepository.updateMyPage(userId, partialEntity);
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        user_repository_1.UserRepository,
        rankerProfile_repository_1.RankerProfileRepository,
        community_repository_1.CommunityRepository])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map