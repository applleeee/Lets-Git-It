import { CommunityService } from './../community/community.service';
import { Strategy } from 'passport-jwt';
import { AuthorizedUser } from './dto/auth.dto';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly communityService;
    constructor(communityService: CommunityService);
    validate(payload: any): Promise<AuthorizedUser>;
}
export {};
