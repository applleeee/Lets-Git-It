import { CommunityService } from './../community/community.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { AuthorizedUser } from './dto/auth.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly communityService: CommunityService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any): Promise<AuthorizedUser> {
    const userId: number = payload.userId;

    const idsOfPostsCreatedByUser =
      await this.communityService.getIdsOfPostsCreatedByUser(userId);

    const idsOfPostLikedByUser =
      await this.communityService.getIdsOfPostLikedByUser(userId);

    const idsOfCommentsCreatedByUser =
      await this.communityService.getIdsOfCommentCreatedByUser(userId);

    const idsOfCommentLikedByUser =
      await this.communityService.getIdsOfCommentLikedByUser(userId);

    const user = {
      id: userId,
      idsOfPostsCreatedByUser,
      idsOfPostLikedByUser,
      idsOfCommentsCreatedByUser,
      idsOfCommentLikedByUser,
    };
    return user;
  }
}
