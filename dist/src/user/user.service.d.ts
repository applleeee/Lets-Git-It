import { RankerProfileRepository } from './../rank/rankerProfile.repository';
import { SignUpDto } from './../auth/dto/auth.dto';
import { User } from 'src/entities/User';
import { UserRepository } from './user.repository';
import { HttpService } from '@nestjs/axios';
import { CommunityRepository } from 'src/community/community.repository';
import { MyPageDto, UpdateMyPageDto } from './dto/mypage.dto';
export declare class UserService {
    private readonly http;
    private readonly userRepository;
    private readonly rankerProfileRepository;
    private readonly communityRepository;
    constructor(http: HttpService, userRepository: UserRepository, rankerProfileRepository: RankerProfileRepository, communityRepository: CommunityRepository);
    getByGithubId(githubId: number): Promise<User>;
    getById(id: number): Promise<User>;
    getGithubAccessToken(code: string): Promise<any>;
    getByGithubAccessToken(githubAccessToken: string): Promise<any>;
    createUser(signUpData: SignUpDto): Promise<void>;
    getMyPage(userId: number): Promise<MyPageDto>;
    updateMyPage(userId: number, partialEntity: UpdateMyPageDto): Promise<void>;
}
