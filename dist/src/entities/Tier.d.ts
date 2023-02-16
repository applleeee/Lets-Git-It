import { Ranking } from './Ranking';
export declare class Tier {
    id: number;
    name: string | null;
    imageUrl: string | null;
    startPercent: string | null;
    endPercent: string | null;
    rankings: Ranking[];
}
