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
exports.RankerProfileRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const RankerProfile_1 = require("../entities/RankerProfile");
const Ranking_1 = require("../entities/Ranking");
const Tier_1 = require("../entities/Tier");
let RankerProfileRepository = class RankerProfileRepository {
    constructor(rankerProfileRepository) {
        this.rankerProfileRepository = rankerProfileRepository;
    }
    async checkRanker(name) {
        return await this.rankerProfileRepository.exist({ where: { name } });
    }
    async getRankerId(name) {
        const { id } = await this.rankerProfileRepository.findOne({
            where: { name },
        });
        return id;
    }
    async createRankerProfile(data) {
        await this.rankerProfileRepository
            .createQueryBuilder()
            .insert()
            .into(RankerProfile_1.RankerProfile)
            .values([
            {
                name: data['login'],
                profileImageUrl: data['avatar_url'],
                profileText: data['bio'],
                homepageUrl: data['blog'],
                email: data['email'],
                company: data['company'],
                region: data['location'],
            },
        ])
            .execute();
    }
    async getRankerProfile(name) {
        const { id } = await this.rankerProfileRepository.findOne({
            where: { name },
        });
        const rankerProfile = await this.rankerProfileRepository
            .createQueryBuilder()
            .select([
            'RankerProfile.id as rankerId',
            'RankerProfile.name as rankerName',
            'RankerProfile.profile_image_url as profileImage',
            'RankerProfile.homepage_url as blog',
            'RankerProfile.email as email',
            'RankerProfile.company as company',
            'RankerProfile.region as region',
            'r.main_language as mainLang',
            'r.curiosity_score as curiosityScore',
            'r.passion_score as passionScore',
            'r.fame_score as fameScore',
            'r.ability_score as abilityScore',
            'r.total_score as totalScore',
            'r.curiosity_raise_issue_number as issueNumber',
            'r.curiosity_fork_repository_number as forkingNumber',
            'r.curiosity_give_star_repository_number as starringNumber',
            'r.curiosity_following_number as followingNumber',
            'r.passion_commit_number as commitNumber',
            'r.passion_pr_number as prNumber',
            'r.passion_review_number as reviewNumber',
            'r.passion_create_repository_number as personalRepoNumber',
            'r.fame_follower_number as followerNumber',
            'r.fame_repository_forked_number as forkedNumber',
            'r.fame_repository_watched_number as watchedNumber',
            'r.ability_sponsered_number as sponsorNumber',
            'r.ability_contribute_repository_star_number as contributingRepoStarNumber',
            'r.ability_public_repository_star_number as myStarNumber',
            't.name as tier',
            't.image_url as tierImage',
        ])
            .leftJoin(Ranking_1.Ranking, `r`, 'RankerProfile.id = r.ranker_profile_id')
            .leftJoin(Tier_1.Tier, `t`, `t.id=r.tier_id`)
            .where(`RankerProfile.id=:id`, { id })
            .getRawOne();
        return rankerProfile;
    }
    async getTop5() {
        const top5 = await this.rankerProfileRepository
            .createQueryBuilder()
            .select([
            'RankerProfile.name as rankerName',
            'RankerProfile.profile_image_url as profileImage',
            'ROUND(ranking.total_score,0) as totalScore',
        ])
            .leftJoin(Ranking_1.Ranking, 'ranking', 'ranking.ranker_profile_id=RankerProfile.id')
            .orderBy('totalScore', 'DESC')
            .limit(5)
            .getRawMany();
        return top5;
    }
    async getTop100(lang) {
        const top100 = await this.rankerProfileRepository
            .createQueryBuilder()
            .select([
            'RankerProfile.name as rankerName',
            'r.main_language as mainLang',
            'r.fame_follower_number as followerNumber',
            'r.ability_public_repository_star_number as myStarNumber',
            'r.passion_commit_number as commitNumber',
            'r.total_score as totalScore',
            't.name as tier',
            't.image_url as tierImage',
        ])
            .leftJoin(Ranking_1.Ranking, 'r', 'r.ranker_profile_id = RankerProfile.id')
            .leftJoin(Tier_1.Tier, 't', 't.id = r.tier_id')
            .where(`r.main_language ${lang}`)
            .orderBy('totalScore', 'DESC')
            .limit(100)
            .getRawMany();
        return top100;
    }
    async findRanker(userName) {
        const ranker = await this.rankerProfileRepository
            .createQueryBuilder()
            .select([
            'RankerProfile.name as rankerName',
            'RankerProfile.profile_image_url as profileImage',
            't.image_url as tierImage',
        ])
            .leftJoin(Ranking_1.Ranking, `r`, 'RankerProfile.id = r.ranker_profile_id')
            .leftJoin(Tier_1.Tier, `t`, `t.id=r.tier_id`)
            .where('RankerProfile.name LIKE :rankerName', {
            rankerName: `%${userName}%`,
        })
            .getRawMany();
        return ranker;
    }
    async getMyPage(userId) {
        let result;
        const ranker = await this.rankerProfileRepository.findBy({
            userId: userId,
        });
        if (!ranker) {
            result = {
                userName: '랭킹 정보를 검색해주세요!',
                profileText: '랭킹 정보를 검색해주세요!',
                profileImageUrl: '랭킹 정보를 검색해주세요!',
                email: '랭킹 정보를 검색해주세요!',
            };
        }
        else {
            result = ranker;
        }
        return result;
    }
    async updateRankerProfile(userName, profileImageUrl, homepageUrl, email, company, region, userId) {
        return await this.rankerProfileRepository
            .createQueryBuilder()
            .update(RankerProfile_1.RankerProfile)
            .set({ profileImageUrl, homepageUrl, email, company, region, userId })
            .where('name = :name', { name: userName })
            .execute();
    }
};
RankerProfileRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(RankerProfile_1.RankerProfile)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RankerProfileRepository);
exports.RankerProfileRepository = RankerProfileRepository;
//# sourceMappingURL=rankerProfile.repository.js.map