import { Repository } from 'typeorm';
import { User } from '../entities/User';
import { SignUpDto } from '../auth/dto/auth.dto';
import { UpdateMyPageDto } from './dto/mypage.dto';
export declare class UserRepository {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    getByGithubId(githubId: number): Promise<User>;
    getUserIdByGithubId(githubId: number): Promise<number>;
    getByUserId(id: number): Promise<User>;
    createUser(signUpData: SignUpDto): Promise<void>;
    updateMyPage(userId: number, partialEntity: UpdateMyPageDto): Promise<void>;
}
