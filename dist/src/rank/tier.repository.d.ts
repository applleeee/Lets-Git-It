import { Repository } from 'typeorm';
import { Tier } from '../entities/Tier';
export declare class TierRepository {
    private tierRepository;
    constructor(tierRepository: Repository<Tier>);
    getTierData(): Promise<Tier[]>;
}
