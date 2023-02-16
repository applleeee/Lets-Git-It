import { User } from './User';
import { Ranking } from './Ranking';
export declare class RankerProfile {
    id: number;
    name: string;
    profileImageUrl: string | null;
    profileText: string | null;
    homepageUrl: string | null;
    email: string | null;
    company: string | null;
    region: string | null;
    userId: number | null;
    createdAt: Date;
    updatedAt: Date | null;
    user: User;
    rankings: Ranking[];
}
