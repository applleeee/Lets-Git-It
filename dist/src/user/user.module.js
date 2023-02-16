"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const community_repository_1 = require("./../community/community.repository");
const Post_1 = require("./../entities/Post");
const RankerProfile_1 = require("../entities/RankerProfile");
const typeorm_1 = require("@nestjs/typeorm");
const User_1 = require("../entities/User");
const Field_1 = require("../entities/Field");
const Career_1 = require("../entities/Career");
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const user_repository_1 = require("./user.repository");
const user_controller_1 = require("./user.controller");
const rankerProfile_repository_1 = require("../rank/rankerProfile.repository");
const rank_module_1 = require("../rank/rank.module");
const SubCategory_1 = require("../entities/SubCategory");
const PostLike_1 = require("../entities/PostLike");
const Comment_1 = require("../entities/Comment");
const CommentLike_1 = require("../entities/CommentLike");
let UserModule = class UserModule {
};
UserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                User_1.User,
                Field_1.Field,
                Career_1.Career,
                RankerProfile_1.RankerProfile,
                Post_1.Post,
                SubCategory_1.SubCategory,
                PostLike_1.PostLike,
                Comment_1.Comment,
                CommentLike_1.CommentLike,
            ]),
            axios_1.HttpModule,
            rank_module_1.RankModule,
        ],
        providers: [
            user_service_1.UserService,
            user_repository_1.UserRepository,
            rankerProfile_repository_1.RankerProfileRepository,
            community_repository_1.CommunityRepository,
        ],
        exports: [user_service_1.UserService, user_repository_1.UserRepository],
        controllers: [user_controller_1.UserController],
    })
], UserModule);
exports.UserModule = UserModule;
//# sourceMappingURL=user.module.js.map