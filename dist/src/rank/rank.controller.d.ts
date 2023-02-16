import { RankerProfileOutput, SearchOutput, Top100, Top5 } from './dto/rankerProfile.dto';
import { AvgValuesOutput, MaxValuesOutput } from './dto/ranking.dto';
import { RankService } from './rank.service';
export declare class RankController {
    private rankService;
    constructor(rankService: RankService);
    findRanker(userName: string): Promise<SearchOutput[]>;
    getRankerDetail(userName: string): Promise<{
        rankerDetail: RankerProfileOutput;
        maxValues: MaxValuesOutput;
        avgValues: AvgValuesOutput;
    }>;
    getTop5(): Promise<Top5[]>;
    getTop100(langFilter: string): Promise<{
        langCategory: unknown[];
        top100: Top100[];
    }>;
    compareRanker(userName: string[]): Promise<{
        firstUser: {
            rankerDetail: RankerProfileOutput;
            maxValues: MaxValuesOutput;
            avgValues: AvgValuesOutput;
        };
        secondUser: {
            rankerDetail: RankerProfileOutput;
            maxValues: MaxValuesOutput;
            avgValues: AvgValuesOutput;
        };
    }>;
}
