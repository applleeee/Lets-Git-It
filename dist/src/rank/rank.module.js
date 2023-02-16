"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const RankerProfile_1 = require("../entities/RankerProfile");
const Ranking_1 = require("../entities/Ranking");
const Tier_1 = require("../entities/Tier");
const rank_controller_1 = require("./rank.controller");
const rankerProfile_repository_1 = require("./rankerProfile.repository");
const rank_service_1 = require("./rank.service");
const ranking_repository_1 = require("./ranking.repository");
const tier_repository_1 = require("./tier.repository");
const User_1 = require("../entities/User");
const Comment_1 = require("../entities/Comment");
const CommentLike_1 = require("../entities/CommentLike");
const Post_1 = require("../entities/Post");
const PostLike_1 = require("../entities/PostLike");
const Field_1 = require("../entities/Field");
const Career_1 = require("../entities/Career");
let RankModule = class RankModule {
};
RankModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                RankerProfile_1.RankerProfile,
                Ranking_1.Ranking,
                Tier_1.Tier,
                User_1.User,
                Comment_1.Comment,
                CommentLike_1.CommentLike,
                Post_1.Post,
                PostLike_1.PostLike,
                Field_1.Field,
                Career_1.Career,
            ]),
        ],
        controllers: [rank_controller_1.RankController],
        providers: [
            rank_service_1.RankService,
            rankerProfile_repository_1.RankerProfileRepository,
            ranking_repository_1.RankingRepository,
            tier_repository_1.TierRepository,
        ],
        exports: [rankerProfile_repository_1.RankerProfileRepository],
    })
], RankModule);
exports.RankModule = RankModule;
//# sourceMappingURL=rank.module.js.map