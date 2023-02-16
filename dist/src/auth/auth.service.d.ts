import { RankerProfileRepository } from 'src/rank/rankerProfile.repository';
import { UserRepository } from './../user/user.repository';
import { RankService } from './../rank/rank.service';
import { UserService } from './../user/user.service';
import { GithubCodeDto, SignUpWithUserNameDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    private readonly authRepository;
    private readonly rankService;
    private readonly userRepository;
    private readonly rankerProfileRepository;
    constructor(userService: UserService, jwtService: JwtService, authRepository: AuthRepository, rankService: RankService, userRepository: UserRepository, rankerProfileRepository: RankerProfileRepository);
    signIn(githubCode: GithubCodeDto): Promise<{
        isMemeber: boolean;
        userName: any;
        accessToken: string;
        isMember?: undefined;
        githubId?: undefined;
    } | {
        isMember: boolean;
        userName: any;
        githubId: any;
        isMemeber?: undefined;
        accessToken?: undefined;
    }>;
    signUp(signUpDataWithUserName: SignUpWithUserNameDto): Promise<{
        accessToken: string;
    }>;
    getAuthCategory(): Promise<{
        field: import("../entities/Field").Field[];
        career: import("../entities/Career").Career[];
    }>;
}
