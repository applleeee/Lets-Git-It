export declare enum SortEnum {
    latest = "latest",
    mostLiked = "mostLiked"
}
export declare enum DateEnum {
    all = "all",
    year = "year",
    month = "month",
    week = "week",
    day = "day"
}
export declare class GetPostListDto {
    readonly sort: SortEnum;
    readonly date: DateEnum;
    readonly offset: number;
    readonly limit: number;
}
