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
exports.RankingRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Ranking_1 = require("../entities/Ranking");
let RankingRepository = class RankingRepository {
    constructor(rankingRepository) {
        this.rankingRepository = rankingRepository;
    }
    async getAllScores() {
        return await this.rankingRepository
            .createQueryBuilder()
            .select('total_score')
            .getRawMany();
    }
    async registerRanking(mainLanguage, curiosityScore, passionScore, fameScore, abilityScore, totalScore, issuesCount, forkingCount, starringCount, followingCount, commitsCount, pullRequestCount, reviewCount, personalRepoCount, followersCount, forkedCount, watchersCount, sponsorsCount, myStarsCount, contributingRepoStarsCount, rankerProfileId, tierId) {
        await this.rankingRepository
            .createQueryBuilder()
            .insert()
            .into(Ranking_1.Ranking)
            .values([
            {
                mainLanguage,
                curiosityScore,
                passionScore,
                fameScore,
                abilityScore,
                totalScore,
                curiosityRaiseIssueNumber: issuesCount,
                curiosityForkRepositoryNumber: forkingCount,
                curiosityGiveStarRepositoryNumber: starringCount,
                curiosityFollowingNumber: followingCount,
                passionCommitNumber: commitsCount,
                passionPrNumber: pullRequestCount,
                passionReviewNumber: reviewCount,
                passionCreateRepositoryNumber: personalRepoCount,
                fameFollowerNumber: followersCount,
                fameRepositoryForkedNumber: forkedCount,
                fameRepositoryWatchedNumber: watchersCount,
                abilitySponseredNumber: sponsorsCount,
                abilityPublicRepositoryStarNumber: myStarsCount,
                abilityContributeRepositoryStarNumber: contributingRepoStarsCount,
                rankerProfileId,
                tierId,
            },
        ])
            .execute();
    }
    async getMaxValues() {
        const maxValues = await this.rankingRepository
            .createQueryBuilder()
            .select([
            'MAX(curiosity_score) as maxCuriosityScore',
            'MAX(passion_score) as maxPassionScore',
            'MAX(fame_score) as maxFameScore',
            'MAX(ability_score) as maxAbilityScore',
            'MAX(total_score) as maxTotalScore',
            'MAX(curiosity_raise_issue_number) as maxIssueNumber',
            'MAX(curiosity_fork_repository_number) as maxForkingNumber',
            'MAX(curiosity_give_star_repository_number) as maxStarringNumber',
            'MAX(curiosity_following_number) as maxFollowingNumber',
            'MAX(passion_commit_number) as maxCommitNumber',
            'MAX(passion_pr_number) as maxPRNumber',
            'MAX(passion_review_number) as maxReviewNumber',
            'MAX(passion_create_repository_number) as maxPersonalRepoNumber',
            'MAX(fame_follower_number) as maxFollowerNumber',
            'MAX(fame_repository_forked_number) as maxForkedNumber',
            'MAX(fame_repository_watched_number) as maxWatchedNumber',
            'MAX(ability_sponsered_number) as maxSponsorNumber',
            'MAX(ability_contribute_repository_star_number) as maxContributingRepoStarNumber',
            'MAX(ability_public_repository_star_number) as maxMyStartNumber',
        ])
            .getRawOne();
        return maxValues;
    }
    async getAvgValues() {
        const avgValues = await this.rankingRepository
            .createQueryBuilder()
            .select([
            'CEIL(AVG(curiosity_score)) as avgCuriosityScore',
            'CEIL(AVG(passion_score)) as avgPassionScore',
            'CEIL(AVG(fame_score)) as avgFameScore',
            'CEIL(AVG(ability_score)) as avgAbilityScore',
            'CEIL(AVG(total_score)) as avgTotalScore',
            'CEIL(AVG(curiosity_raise_issue_number)) as avgIssueNumber',
            'CEIL(AVG(curiosity_fork_repository_number)) as avgForkingNumber',
            'CEIL(AVG(curiosity_give_star_repository_number)) as avgStarringNumber',
            'CEIL(AVG(curiosity_following_number)) as avgFollowingNumber',
            'CEIL(AVG(passion_commit_number)) as avgCommitNumber',
            'CEIL(AVG(passion_pr_number)) as avgPRNumber',
            'CEIL(AVG(passion_review_number)) as avgReviewNumber',
            'CEIL(AVG(passion_create_repository_number)) as avgPersonalRepoNumber',
            'CEIL(AVG(fame_follower_number)) as avgFollowerNumber',
            'CEIL(AVG(fame_repository_forked_number)) as avgForkedNumber',
            'CEIL(AVG(fame_repository_watched_number)) as avgWatchedNumber',
            'CEIL(AVG(ability_sponsered_number)) as avgSponsorNumber',
            'CEIL(AVG(ability_contribute_repository_star_number)) as avgContributingRepoStarNumber',
            'CEIL(AVG(ability_public_repository_star_number)) as avgMyStartNumber',
        ])
            .getRawOne();
        return avgValues;
    }
    async getTop100Languages() {
        const top100Lang = await this.rankingRepository
            .createQueryBuilder()
            .select('main_language')
            .orderBy('total_score', 'DESC')
            .limit(100)
            .getRawMany();
        return top100Lang;
    }
};
RankingRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Ranking_1.Ranking)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RankingRepository);
exports.RankingRepository = RankingRepository;
//# sourceMappingURL=ranking.repository.js.map