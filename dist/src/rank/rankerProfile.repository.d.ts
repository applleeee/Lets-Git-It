import { Repository } from 'typeorm';
import { RankerProfile } from '../entities/RankerProfile';
import { RankerProfileOutput, SearchOutput, Top100, Top5 } from './dto/rankerProfile.dto';
export declare class RankerProfileRepository {
    private rankerProfileRepository;
    constructor(rankerProfileRepository: Repository<RankerProfile>);
    checkRanker(name: string): Promise<boolean>;
    getRankerId(name: string): Promise<number>;
    createRankerProfile(data: RankerProfile): Promise<void>;
    getRankerProfile(name: string): Promise<RankerProfileOutput>;
    getTop5(): Promise<Top5[]>;
    getTop100(lang: string): Promise<Top100[]>;
    findRanker(userName: string): Promise<SearchOutput[]>;
    getMyPage(userId: number): Promise<any>;
    updateRankerProfile(userName: any, profileImageUrl: any, homepageUrl: any, email: any, company: any, region: any, userId: any): Promise<import("typeorm").UpdateResult>;
}
