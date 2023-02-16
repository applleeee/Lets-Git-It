import { TestService } from './test.service';
export declare class TestController {
    private testService;
    constructor(testService: TestService);
    ping(): {
        data: string;
    };
    getUser(): Promise<import("./entities/test.entity").users[]>;
    postUser(): Promise<string>;
}
