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
exports.JwtStrategy = void 0;
const community_service_1 = require("./../community/community.service");
const passport_jwt_1 = require("passport-jwt");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const constants_1 = require("./constants");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(communityService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: constants_1.jwtConstants.secret,
        });
        this.communityService = communityService;
    }
    async validate(payload) {
        const userId = payload.userId;
        const idsOfPostsCreatedByUser = await this.communityService.getIdsOfPostsCreatedByUser(userId);
        const idsOfPostLikedByUser = await this.communityService.getIdsOfPostLikedByUser(userId);
        const idsOfCommentsCreatedByUser = await this.communityService.getIdsOfCommentCreatedByUser(userId);
        const idsOfCommentLikedByUser = await this.communityService.getIdsOfCommentLikedByUser(userId);
        const user = {
            id: userId,
            idsOfPostsCreatedByUser,
            idsOfPostLikedByUser,
            idsOfCommentsCreatedByUser,
            idsOfCommentLikedByUser,
        };
        return user;
    }
};
JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [community_service_1.CommunityService])
], JwtStrategy);
exports.JwtStrategy = JwtStrategy;
//# sourceMappingURL=jwt.strategy.js.map