import { Comment } from '../../entities/comment.orm-entity';
import { Post } from '../../entities/post.orm-entity';

export interface AccessTokenPayload {
  userId: string;
  userName: string;
}

export interface RefreshTokenPayload {
  userId: string;
}

export interface RefreshTokenProps {
  hashedRefreshToken: string;
  userId: string;
}

export interface CreateRefreshTokenProps {
  hashedRefreshToken: string;
  userId: string;
}

export interface JwtAccessToken {
  accessToken: string;
}

export interface JwtRefreshToken {
  refreshToken: string;
}

export interface UpdateRefreshTokenProps extends JwtRefreshToken {
  userId: string;
}

export interface CookieOptions {
  domain: string;
  path: string;
  httpOnly: boolean;
  sameSite: boolean | 'lax' | 'strict' | 'none' | undefined;
  secure: boolean;
  signed: boolean;
  maxAge?: number | undefined;
}

export interface AuthorizedUser {
  readonly id: string;
  readonly userName: string;
  readonly idsOfPostsCreatedByUser?: Post[];
  readonly idsOfPostLikedByUser?: number[];
  readonly idsOfCommentsCreatedByUser?: Comment[];
  readonly idsOfCommentLikedByUser?: number[];
}
