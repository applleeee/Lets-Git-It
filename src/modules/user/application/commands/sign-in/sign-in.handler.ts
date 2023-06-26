import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignInCommand } from './sign-in.command';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
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
} from '../../dtos/sign-in.response.dto';
import { AuthServicePort } from 'src/modules/user/auth/auth.service.port';
import {} from 'src/modules/auth/domain/auth.types';
import { SignInResOk } from './sign-in.controller';
import { RefreshTokenEntity } from 'src/modules/auth/domain/refresh-token.entity';
import { DataSource } from 'typeorm';
import { UserMapper } from 'src/modules/user/mapper/user.mapper';
import { RefreshTokenMapper } from 'src/modules/auth/mapper/refresh-token.mapper';
import { RefreshToken } from 'src/modules/auth/database/refresh-token.orm-entity';
import { User } from 'src/modules/user/database/entity/user.orm-entity';

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
    private readonly _dataSource: DataSource,
    private readonly _userMapper: UserMapper,
    private readonly _refreshTokenMapper: RefreshTokenMapper,
  ) {}
  async execute(
    command: SignInCommand,
  ): Promise<SignInResOk | SignInUnauthorizedResDto> {
    const { githubId, userName } = await this.getGithubUser(command);

    const userEntity = await this._userRepository.getUserByGithubId(githubId);

    if (!userEntity) {
      return new SignInUnauthorizedResDto({
        isMember: false,
        userName,
        githubId,
      });
    }

    const userId = userEntity.id as string;

    const { accessToken } = this._authService.getJwtAccessToken({
      userId,
      userName,
    });

    const { refreshToken, cookieOptions } =
      this._authService.getCookiesWithJwtRefreshToken({
        userId,
      });

    const hashedRefreshToken = await this._authService.hashRefreshToken(
      refreshToken,
    );

    const refreshTokenEntity = RefreshTokenEntity.create({
      userId,
      hashedRefreshToken,
    });

    const refreshTokenOrmEntity =
      this._refreshTokenMapper.toPersistence(refreshTokenEntity);

    const refreshTokenEntityId = refreshTokenEntity.getProps().id as string;

    userEntity.updateUserRefreshTokenId({
      refreshTokenId: refreshTokenEntityId,
    });

    const userOrmEntity = this._userMapper.toPersistence(userEntity);

    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const refreshTokenInDb = await queryRunner.manager.findOne(RefreshToken, {
        where: { userId },
        select: { id: true, userId: true },
      });

      if (!!refreshTokenInDb) {
        await queryRunner.manager.softDelete(RefreshToken, {
          id: refreshTokenInDb.id,
        });
      }

      await queryRunner.manager.insert(RefreshToken, refreshTokenOrmEntity);
      await queryRunner.manager.update(User, userId, userOrmEntity);

      await queryRunner.commitTransaction();

      const signInOkResDto = new SignInOkResDto({
        isMember: true,
        userName,
        accessToken,
      });

      const result = {
        case: SignInResCase.OK,
        refreshToken,
        signInOkResDto,
        cookieOptions,
      } as SignInResOk;

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new BadRequestException('SIGN_IN_FAILED');
    } finally {
      await queryRunner.release();
    }
  }

  private async getGithubUser({ code }) {
    const { id: githubId, login: userName } =
      await this._githubOauthPort.getGithubUser(code);

    return { githubId, userName };
  }
}
