import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignInCommand } from './sign-in.command';
import { Inject, Injectable } from '@nestjs/common';
import {
  AUTH_SERVICE_ADAPTOR,
  GITHUB_OAUTH_ADAPTOR,
  USER_REPOSITORY,
} from 'src/modules/user/user.di-tokens';
import { UserRepositoryPort } from 'src/modules/user/database/user.repository.port';
import { GithubOauthPort } from 'src/modules/user/github-api/github-oauth.port';
import {
  SignInOkResDto,
  SignInResCase,
  SignInUnauthorizedResDto,
  SignInWrongCodeDto,
  SignInWrongGithubAccessTokenDto,
} from '../../dtos/sign-in.response.dto';
import { AuthServicePort } from 'src/modules/user/auth/auth.service.port';
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from 'src/modules/auth/domain/auth.types';
import { SignInResOk } from './sign-in.controller';

@Injectable()
@CommandHandler(SignInCommand)
export class SignInCommandHandler implements ICommandHandler<SignInCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly _userRepository: UserRepositoryPort,
    @Inject(GITHUB_OAUTH_ADAPTOR)
    private readonly _githubOauthPort: GithubOauthPort,
    @Inject(AUTH_SERVICE_ADAPTOR)
    private readonly _authService: AuthServicePort,
  ) {}
  async execute(
    command: SignInCommand,
  ): Promise<
    | SignInResOk
    | SignInUnauthorizedResDto
    | SignInWrongCodeDto
    | SignInWrongGithubAccessTokenDto
  > {
    const { code } = command;
    const { id, login } = await this._githubOauthPort.getGithubUser(code);
    const user = await this._userRepository.getUserByGithubId(id);

    if (!user) {
      return new SignInUnauthorizedResDto({
        isMember: false,
        userName: login,
        githubId: id,
      });
    }

    const userId = user.id as string;

    const accessTokenPayload: AccessTokenPayload = {
      userId,
      userName: login,
    };

    const { accessToken } = await this._authService.getJwtAccessToken(
      accessTokenPayload,
    );

    const signInOkResDto = new SignInOkResDto({
      isMember: true,
      userName: login,
      accessToken,
    });

    const refreshTokenPayload: RefreshTokenPayload = {
      userId,
    };

    const { refreshToken, cookieOptions } =
      await this._authService.getCookiesWithJwtRefreshToken(
        refreshTokenPayload,
      );

    await this._authService.updateRefreshToken(refreshToken, userId);

    const result = {
      case: SignInResCase.OK,
      refreshToken,
      signInOkResDto,
      cookieOptions,
    } as SignInResOk;

    return result;
  }
}
