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
exports.RankService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const rankerProfile_repository_1 = require("./rankerProfile.repository");
const dotenv = require("dotenv");
const tier_repository_1 = require("./tier.repository");
const ranking_repository_1 = require("./ranking.repository");
dotenv.config();
const TOKEN = process.env.GITHUB_ACCESS_TOKEN;
let RankService = class RankService {
    constructor(rankerProfileRepository, rankingRepository, tierRepository) {
        this.rankerProfileRepository = rankerProfileRepository;
        this.rankingRepository = rankingRepository;
        this.tierRepository = tierRepository;
    }
    async checkRanker(userName) {
        const check = await this.rankerProfileRepository.checkRanker(userName);
        if (check) {
            const rankerDetail = await this.rankerProfileRepository.getRankerProfile(userName);
            const maxValues = await this.rankingRepository.getMaxValues();
            const avgValues = await this.rankingRepository.getAvgValues();
            return { rankerDetail, maxValues, avgValues };
        }
        return this.getRankerDetail(userName);
    }
    async getRankerDetail(userName) {
        console.time('등록,누른 스타 수,팔로잉,팔로워,이슈,PR 그리고 기여 레포의 스타 수, 리뷰 수');
        const users = axios_1.default.get(`https://api.github.com/users/${userName}`, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
        });
        const stars = axios_1.default.get(`https://api.github.com/users/${userName}/starred?per_page=100`, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
        });
        const issues = axios_1.default.get(`https://api.github.com/search/issues?q=author:${userName}`, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
        });
        const pullRequest = axios_1.default.get(`https://api.github.com/search/issues?q=type:pr+author:${userName}`, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
        });
        const eventList = axios_1.default.get(`https://api.github.com/users/${userName}/events?per_page=100`, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
        });
        const [issuesRes, pullRequestRes, usersRes, starsRes, eventListRes] = await Promise.all([issues, pullRequest, users, stars, eventList]);
        await this.rankerProfileRepository.createRankerProfile(usersRes.data);
        const starringCount = starsRes.data.length;
        const followingCount = usersRes.data.following;
        const followersCount = usersRes.data.followers;
        const pullRequestCount = pullRequestRes.data.total_count;
        const issuesCount = issuesRes.data.total_count - pullRequestCount;
        const promises = [];
        const allPR = pullRequestRes.data.items;
        for (let i = 0; i < allPR.length; i++) {
            if (allPR[i].author_association === 'CONTRIBUTOR') {
                promises.push(axios_1.default.get(allPR[i].repository_url, {
                    headers: {
                        Authorization: `Bearer ${TOKEN}`,
                    },
                }));
            }
        }
        const contributingRepos = await Promise.all(promises);
        let contributingRepoStarsCount = 0;
        for (const repo of contributingRepos) {
            contributingRepoStarsCount += repo.data.stargazers_count;
        }
        const reviews = eventListRes.data.filter((event) => event['type'] === 'PullRequestReviewEvent');
        const reviewCount = reviews.length;
        console.timeEnd('등록,누른 스타 수,팔로잉,팔로워,이슈,PR 그리고 기여 레포의 스타 수, 리뷰 수');
        console.time('스폰서 수');
        const sponsors = await axios_1.default.get(`https://ghs.vercel.app/count/${userName}`);
        let sponsorsCount = 0;
        if (!Boolean(sponsors.data)) {
            const sponsorsList = await axios_1.default.get(`https://ghs.vercel.app/sponsors/${userName}`);
            sponsorsCount = sponsorsList.data.sponsors.length;
        }
        console.timeEnd('스폰서 수');
        console.time('커밋 수');
        const commits = await axios_1.default.get(`https://api.github.com/search/commits?q=author:${userName}`, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
        });
        const commitsCount = commits.data.total_count;
        console.timeEnd('커밋 수');
        console.time('주 언어, 포크 한/된 레포, 개인 레포, 내가 받은 스타, 와쳐 수');
        const scoreBasisPromise = axios_1.default.get(`https://api.github.com/users/${userName}/repos?per_page=100`, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
        });
        const reposLangPromises = [];
        const scoreBasis = await scoreBasisPromise;
        const programmingLang = new Object();
        let forkingCount = 0;
        let personalRepoCount = 0;
        let forkedCount = 0;
        let watchersCount = 0;
        let myStarsCount = 0;
        for (const el of scoreBasis.data) {
            const repoName = el.name;
            if (!el.fork) {
                personalRepoCount++;
                reposLangPromises.push(axios_1.default.get(`https://api.github.com/repos/${userName}/${repoName}/languages`, {
                    headers: {
                        Authorization: `Bearer ${TOKEN}`,
                    },
                }));
            }
            else {
                forkingCount++;
            }
            myStarsCount += el.stargazers_count;
            forkedCount += el.forks;
            watchersCount += el.watchers_count;
        }
        const reposLangArray = await Promise.all(reposLangPromises);
        for (const reposLang of reposLangArray) {
            const languages = reposLang.data;
            for (const lang in languages) {
                if (programmingLang.hasOwnProperty(lang)) {
                    programmingLang[lang] += languages[lang];
                }
                else {
                    programmingLang[lang] = languages[lang];
                }
            }
        }
        const maxBit = Math.max(...Object.values(programmingLang));
        const mainLanguage = maxBit > 0
            ? Object.keys(programmingLang).find((key) => programmingLang[key] === maxBit)
            : 'none';
        console.timeEnd('주 언어, 포크 한/된 레포, 개인 레포, 내가 받은 스타, 와쳐 수');
        console.time('점수 및 티어 계산');
        const curiosityScore = (issuesCount * 5 +
            forkingCount * 4 +
            starringCount * 2 +
            followingCount * 1) *
            0.1;
        const passionScore = (commitsCount * 5 +
            pullRequestCount * 4 +
            reviewCount * 2 +
            personalRepoCount * 1) *
            0.2;
        const fameScore = (followersCount * 5 + forkedCount * 4 + watchersCount * 3) * 0.35;
        const abilityScore = (sponsorsCount * 5 + myStarsCount * 4 + contributingRepoStarsCount * 3) *
            0.35;
        const totalScore = Math.floor(curiosityScore + passionScore + fameScore + abilityScore);
        const tierData = await this.tierRepository.getTierData();
        const scores = await this.rankingRepository.getAllScores();
        const ranking = scores
            .map((el) => parseFloat(el.total_score))
            .concat(totalScore)
            .sort((a, b) => b - a);
        const percentile = ((ranking.indexOf(totalScore) + 1) / ranking.length) * 100;
        let tierId = 0;
        for (const t of tierData) {
            if (percentile > parseFloat(t.endPercent) &&
                percentile <= parseFloat(t.startPercent)) {
                tierId = t.id;
            }
        }
        const rankerProfileId = await this.rankerProfileRepository.getRankerId(userName);
        await this.rankingRepository.registerRanking(mainLanguage, curiosityScore, passionScore, fameScore, abilityScore, totalScore, issuesCount, forkingCount, starringCount, followingCount, commitsCount, pullRequestCount, reviewCount, personalRepoCount, followersCount, forkedCount, watchersCount, sponsorsCount, myStarsCount, contributingRepoStarsCount, rankerProfileId, tierId);
        console.timeEnd('점수 및 티어 계산');
        const rankerDetail = await this.rankerProfileRepository.getRankerProfile(userName);
        const maxValues = await this.rankingRepository.getMaxValues();
        const avgValues = await this.rankingRepository.getAvgValues();
        return { rankerDetail, maxValues, avgValues };
    }
    async getTop5() {
        return await this.rankerProfileRepository.getTop5();
    }
    async getTop100(langFilter) {
        let lang = '';
        if (langFilter === 'All') {
            lang = `IS NOT NULL`;
        }
        else if (typeof langFilter === 'string') {
            lang = `= '${langFilter}'`;
        }
        else {
            lang = `IS NOT NULL`;
        }
        const top100 = await this.rankerProfileRepository.getTop100(lang);
        const top100Lang = await this.rankingRepository.getTop100Languages();
        const mainLanguages = new Set();
        top100Lang.forEach((el) => mainLanguages.add(el.main_language));
        const langCategory = Array.from(mainLanguages);
        return { langCategory, top100 };
    }
    async findRanker(userName) {
        return await this.rankerProfileRepository.findRanker(userName);
    }
};
RankService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [rankerProfile_repository_1.RankerProfileRepository,
        ranking_repository_1.RankingRepository,
        tier_repository_1.TierRepository])
], RankService);
exports.RankService = RankService;
//# sourceMappingURL=rank.service.js.map