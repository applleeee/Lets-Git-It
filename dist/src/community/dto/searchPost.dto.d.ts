export declare enum OptionEnum {
    title = "title",
    author = "author",
    title_author = "title_author"
}
export declare class SearchDto {
    readonly option: OptionEnum;
    readonly keyword: string;
    readonly offset: number;
    readonly limit: number;
}
