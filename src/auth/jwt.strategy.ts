import { RankerProfileRepository } from '../rank/rankerProfile.repository';
import { CommunityService } from './../community/community.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { jwtConstants } from './constants';
import { AuthorizedUser } from './dto/auth.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly communityService: CommunityService,
    private readonly rankerProfileRepository: RankerProfileRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any): Promise<AuthorizedUser> {
    const { userId, userName } = payload;

    const userNameInDb = await this.rankerProfileRepository.getUserNameByUserId(
      userId,
    );

    if (userNameInDb !== userName)
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);

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
