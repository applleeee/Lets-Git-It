import { RankerProfileRepository } from './rankerProfile.repository';
import { TierRepository } from './tier.repository';
import { RankingRepository } from './ranking.repository';
import { SearchOutput, Top100, Top5 } from './dto/rankerProfile.dto';
export declare class RankService {
    private rankerProfileRepository;
    private rankingRepository;
    private tierRepository;
    constructor(rankerProfileRepository: RankerProfileRepository, rankingRepository: RankingRepository, tierRepository: TierRepository);
    checkRanker(userName: string): Promise<{
        rankerDetail: import("./dto/rankerProfile.dto").RankerProfileOutput;
        maxValues: import("./dto/ranking.dto").MaxValuesOutput;
        avgValues: import("./dto/ranking.dto").AvgValuesOutput;
    }>;
    getRankerDetail(userName: string): Promise<{
        rankerDetail: import("./dto/rankerProfile.dto").RankerProfileOutput;
        maxValues: import("./dto/ranking.dto").MaxValuesOutput;
        avgValues: import("./dto/ranking.dto").AvgValuesOutput;
    }>;
    getTop5(): Promise<Top5[]>;
    getTop100(langFilter: string): Promise<{
        langCategory: unknown[];
        top100: Top100[];
    }>;
    findRanker(userName: string): Promise<SearchOutput[]>;
}
