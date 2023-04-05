import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

/**
 * @author MyeongSeok
 * @description 인가가 필요한 기능에 사용하는 auth guard입니다. 인가된 유저라면 상태 유지정보를 포함한 user 객체를 req 객체에 주입합니다.
 * @example user = { id:1, userName: 'user', idsOfPostsCreatedByUser :[1,2], idsOfPostLikedByUser:[1,2], idsOfCommentsCreatedByUser::[1,2], idsOfCommentLikedByUser:[1,2] }
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
