import { UserService } from './user.service';
import { UpdateMyPageDto } from './dto/mypage.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getMyPage(req: any): Promise<import("./dto/mypage.dto").MyPageDto>;
    updateMyPage(body: UpdateMyPageDto, req: any): Promise<{
        message: string;
    }>;
}
