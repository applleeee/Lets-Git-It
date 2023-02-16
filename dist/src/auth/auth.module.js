"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const community_repository_1 = require("./../community/community.repository");
const MainCategory_1 = require("../entities/MainCategory");
const SubCategory_1 = require("../entities/SubCategory");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const User_1 = require("../entities/User");
const Field_1 = require("../entities/Field");
const Career_1 = require("../entities/Career");
const axios_1 = require("@nestjs/axios");
const user_module_1 = require("../user/user.module");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../user/user.service");
const constants_1 = require("./constants");
const jwt_strategy_1 = require("./jwt.strategy");
const passport_1 = require("@nestjs/passport");
const auth_repository_1 = require("./auth.repository");
const rank_module_1 = require("../rank/rank.module");
const Post_1 = require("../entities/Post");
const PostLike_1 = require("../entities/PostLike");
const CommentLike_1 = require("../entities/CommentLike");
const RankerProfile_1 = require("../entities/RankerProfile");
const Ranking_1 = require("../entities/Ranking");
const Tier_1 = require("../entities/Tier");
const Comment_1 = require("../entities/Comment");
const community_service_1 = require("../community/community.service");
const rank_service_1 = require("../rank/rank.service");
const ranking_repository_1 = require("../rank/ranking.repository");
const tier_repository_1 = require("../rank/tier.repository");
const user_repository_1 = require("../user/user.repository");
const rankerProfile_repository_1 = require("../rank/rankerProfile.repository");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                User_1.User,
                Field_1.Field,
                Career_1.Career,
                SubCategory_1.SubCategory,
                MainCategory_1.MainCategory,
                Post_1.Post,
                PostLike_1.PostLike,
                Comment_1.Comment,
                CommentLike_1.CommentLike,
                RankerProfile_1.RankerProfile,
                Ranking_1.Ranking,
                Tier_1.Tier,
            ]),
            axios_1.HttpModule,
            user_module_1.UserModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: constants_1.jwtConstants.secret,
                signOptions: { expiresIn: constants_1.jwtConstants.expiresIn },
            }),
            rank_module_1.RankModule,
            RankerProfile_1.RankerProfile,
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            user_service_1.UserService,
            jwt_strategy_1.JwtStrategy,
            auth_repository_1.AuthRepository,
            community_repository_1.CommunityRepository,
            community_service_1.CommunityService,
            rank_service_1.RankService,
            ranking_repository_1.RankingRepository,
            tier_repository_1.TierRepository,
            user_repository_1.UserRepository,
            rankerProfile_repository_1.RankerProfileRepository,
        ],
        exports: [auth_service_1.AuthService, auth_repository_1.AuthRepository],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map