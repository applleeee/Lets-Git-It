import { Repository } from 'typeorm';
import { Ranking } from '../entities/Ranking';
import { AvgValuesOutput, LangOutput, MaxValuesOutput, TotalScoresOutput } from './dto/ranking.dto';
export declare class RankingRepository {
    private rankingRepository;
    constructor(rankingRepository: Repository<Ranking>);
    getAllScores(): Promise<TotalScoresOutput[]>;
    registerRanking(mainLanguage: string, curiosityScore: number, passionScore: number, fameScore: number, abilityScore: number, totalScore: number, issuesCount: number, forkingCount: number, starringCount: number, followingCount: number, commitsCount: number, pullRequestCount: number, reviewCount: number, personalRepoCount: number, followersCount: number, forkedCount: number, watchersCount: number, sponsorsCount: number, myStarsCount: number, contributingRepoStarsCount: number, rankerProfileId: number, tierId: number): Promise<void>;
    getMaxValues(): Promise<MaxValuesOutput>;
    getAvgValues(): Promise<AvgValuesOutput>;
    getTop100Languages(): Promise<LangOutput[]>;
}
