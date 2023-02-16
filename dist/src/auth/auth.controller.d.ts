import { AuthService } from './auth.service';
import { GithubCodeDto, SignUpWithUserNameDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    signUp(userData: SignUpWithUserNameDto): Promise<{
        accessToken: string;
    }>;
    getAuthCategory(): Promise<{
        field: import("../entities/Field").Field[];
        career: import("../entities/Career").Career[];
    }>;
}
