import { RankerProfileRepository } from '../../rank/rankerProfile.repository';
import { CommunityService } from '../../community/community.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import authConfig from '../../../config/authConfig';
import { AccessTokenPayload, AuthorizedUser } from '../domain/auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly communityService: CommunityService,
    private readonly rankerProfileRepository: RankerProfileRepository,
    @Inject(authConfig.KEY)
    private readonly _config: ConfigType<typeof authConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _config.jwtSecret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: AccessTokenPayload): Promise<AuthorizedUser> {
    const { userId, userName: userNameInPayload } = payload;

    const userNameInDb = await this.rankerProfileRepository.getUserNameByUserId(
      userId,
    );

    const user: AuthorizedUser = await this.getAuthorizedUser(
      userId,
      userNameInPayload,
      userNameInDb,
    );

    return user;
  }

  private async getAuthorizedUser(
    userId: string,
    userNameInPayload: string,
    userNameInDb: string,
  ) {
    this.compareUserName(userNameInPayload, userNameInDb);

    const idsOfPostsCreatedByUser =
      await this.communityService.getIdsOfPostsCreatedByUser(userId);

    const idsOfPostLikedByUser =
      await this.communityService.getIdsOfPostLikedByUser(userId);

    const idsOfCommentsCreatedByUser =
      await this.communityService.getIdsOfCommentCreatedByUser(userId);

    const idsOfCommentLikedByUser =
      await this.communityService.getIdsOfCommentLikedByUser(userId);

    const user: AuthorizedUser = {
      id: userId,
      userName: userNameInDb,
      idsOfPostsCreatedByUser,
      idsOfPostLikedByUser,
      idsOfCommentsCreatedByUser,
      idsOfCommentLikedByUser,
    };

    return user;
  }

  private compareUserName(userNameInPayload: string, userNameInDb: string) {
    if (userNameInDb !== userNameInPayload)
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
  }
}
