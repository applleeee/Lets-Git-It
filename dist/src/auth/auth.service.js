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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const rankerProfile_repository_1 = require("../rank/rankerProfile.repository");
const user_repository_1 = require("./../user/user.repository");
const rank_service_1 = require("./../rank/rank.service");
const user_service_1 = require("./../user/user.service");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const dotenv = require("dotenv");
const auth_repository_1 = require("./auth.repository");
dotenv.config();
let AuthService = class AuthService {
    constructor(userService, jwtService, authRepository, rankService, userRepository, rankerProfileRepository) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.authRepository = authRepository;
        this.rankService = rankService;
        this.userRepository = userRepository;
        this.rankerProfileRepository = rankerProfileRepository;
    }
    async signIn(githubCode) {
        const { code } = githubCode;
        const githubAccessToken = await this.userService.getGithubAccessToken(code);
        const githubUserInfo = await this.userService.getByGithubAccessToken(githubAccessToken);
        const userName = githubUserInfo.login;
        const user = await this.userService.getByGithubId(githubUserInfo.id);
        if (user) {
            const jwtToken = this.jwtService.sign({
                userId: user.id,
                secretOrPrivateKey: process.env.JWT_SECRET_KEY,
            });
            return { isMemeber: true, userName: userName, accessToken: jwtToken };
        }
        return { isMember: false, userName: userName, githubId: githubUserInfo.id };
    }
    async signUp(signUpDataWithUserName) {
        const { userName } = signUpDataWithUserName, signUpData = __rest(signUpDataWithUserName, ["userName"]);
        await this.userService.createUser(signUpData);
        const user = await this.userService.getByGithubId(signUpData.githubId);
        const jwtToken = this.jwtService.sign({
            userId: user.id,
            secretOrPrivateKey: process.env.JWT_SECRET_KEY,
        });
        const profile = await this.rankService.checkRanker(userName);
        const userId = await this.userRepository.getUserIdByGithubId(user.githubId);
        const ranker = await this.rankerProfileRepository.getRankerProfile(userName);
        const updateRankerProfileDto = {
            profileImageUrl: ranker.profileImage,
            homepageUrl: ranker.blog,
            email: ranker.email,
            company: ranker.company,
            region: ranker.region,
            userId: userId,
        };
        await this.rankerProfileRepository.updateRankerProfile(userName, updateRankerProfileDto.profileImageUrl, updateRankerProfileDto.homepageUrl, updateRankerProfileDto.email, updateRankerProfileDto.company, updateRankerProfileDto.region, updateRankerProfileDto.userId);
        return { accessToken: jwtToken };
    }
    async getAuthCategory() {
        return await this.authRepository.getAuthCategory();
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        auth_repository_1.AuthRepository,
        rank_service_1.RankService,
        user_repository_1.UserRepository,
        rankerProfile_repository_1.RankerProfileRepository])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map