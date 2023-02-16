import { Repository } from 'typeorm';
import { users } from './entities/test.entity';
export declare class TestService {
    private testRepository;
    constructor(testRepository: Repository<users>);
    getAllUser(): Promise<users[]>;
    postUser(users: users): Promise<void>;
}
