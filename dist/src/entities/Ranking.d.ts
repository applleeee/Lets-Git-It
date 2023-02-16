import { RankerProfile } from './RankerProfile';
import { Tier } from './Tier';
export declare class Ranking {
    id: number;
    mainLanguage: string;
    curiosityScore: number;
    passionScore: number;
    fameScore: number;
    abilityScore: number;
    totalScore: number;
    curiosityRaiseIssueNumber: number;
    curiosityForkRepositoryNumber: number;
    curiosityGiveStarRepositoryNumber: number;
    curiosityFollowingNumber: number;
    passionCommitNumber: number;
    passionPrNumber: number;
    passionReviewNumber: number;
    passionCreateRepositoryNumber: number;
    fameFollowerNumber: number;
    fameRepositoryForkedNumber: number;
    fameRepositoryWatchedNumber: number;
    abilitySponseredNumber: number;
    abilityContributeRepositoryStarNumber: number;
    abilityPublicRepositoryStarNumber: number;
    rankerProfileId: number | null;
    tierId: number | null;
    rankerProfile: RankerProfile;
    tier: Tier;
}
