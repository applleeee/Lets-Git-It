export declare class SearchOutput {
    readonly rankerName: string;
    readonly profileImage: string;
    readonly tierImage?: string;
}
export declare class Top5 extends SearchOutput {
    readonly totalScore: string;
}
export declare class Top100 extends Top5 {
    mainLang: string;
    followerNumber: number;
    myStarNumber: number;
    commitNumber: number;
    totalScore: string;
    tier: string;
}
export declare class RankerProfileOutput {
    rankerId: number;
    rankerName: string;
    profileImage: string;
    blog: string;
    email: string;
    company: string;
    region: string;
    mainLang: string;
    curiosityScore: string;
    passionScore: string;
    fameScore: string;
    abilityScore: string;
    totalScore: string;
    issueNumber: number;
    forkingNumber: number;
    starringNumber: number;
    followingNumber: number;
    commitNumber: number;
    prNumber: number;
    reviewNumber: number;
    personalRepoNumber: number;
    followerNumber: number;
    forkedNumber: number;
    watchedNumber: number;
    sponsorNumber: number;
    contributingRepoStarNumber: number;
    myStarNumber: number;
    tier: string;
    tierImage: string;
}
