"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityModule = void 0;
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const community_controller_1 = require("./community.controller");
const community_repository_1 = require("./community.repository");
const community_service_1 = require("./community.service");
const SubCategory_1 = require("../entities/SubCategory");
const MainCategory_1 = require("../entities/MainCategory");
const Post_1 = require("../entities/Post");
const User_1 = require("../entities/User");
const PostLike_1 = require("../entities/PostLike");
const Comment_1 = require("../entities/Comment");
const RankerProfile_1 = require("../entities/RankerProfile");
const Ranking_1 = require("../entities/Ranking");
const Tier_1 = require("../entities/Tier");
const CommentLike_1 = require("../entities/CommentLike");
const auth_module_1 = require("../auth/auth.module");
const user_module_1 = require("../user/user.module");
const constants_1 = require("../auth/constants");
const auth_service_1 = require("../auth/auth.service");
const jwt_strategy_1 = require("../auth/jwt.strategy");
const rankerProfile_repository_1 = require("../rank/rankerProfile.repository");
const rank_service_1 = require("../rank/rank.service");
const rank_module_1 = require("../rank/rank.module");
const ranking_repository_1 = require("../rank/ranking.repository");
const tier_repository_1 = require("../rank/tier.repository");
let CommunityModule = class CommunityModule {
};
CommunityModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                SubCategory_1.SubCategory,
                MainCategory_1.MainCategory,
                Post_1.Post,
                User_1.User,
                PostLike_1.PostLike,
                Comment_1.Comment,
                CommentLike_1.CommentLike,
                RankerProfile_1.RankerProfile,
                Ranking_1.Ranking,
                Tier_1.Tier,
            ]),
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            rank_module_1.RankModule,
            jwt_1.JwtModule.register({
                secret: constants_1.jwtConstants.secret,
                signOptions: { expiresIn: constants_1.jwtConstants.expiresIn },
            }),
        ],
        controllers: [community_controller_1.CommunityController],
        providers: [
            community_service_1.CommunityService,
            community_repository_1.CommunityRepository,
            auth_service_1.AuthService,
            jwt_1.JwtService,
            jwt_strategy_1.JwtStrategy,
            rank_service_1.RankService,
            rankerProfile_repository_1.RankerProfileRepository,
            ranking_repository_1.RankingRepository,
            tier_repository_1.TierRepository,
        ],
        exports: [community_repository_1.CommunityRepository, community_service_1.CommunityService],
    })
], CommunityModule);
exports.CommunityModule = CommunityModule;
//# sourceMappingURL=community.module.js.map