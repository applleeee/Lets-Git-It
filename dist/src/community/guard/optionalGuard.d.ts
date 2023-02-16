declare const OptionalAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class OptionalAuthGuard extends OptionalAuthGuard_base {
    handleRequest(err: any, user: any, info: any): any;
}
export {};
