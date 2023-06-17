import {
  AccessTokenPayload,
  CreateRefreshTokenProps,
  RefreshTokenPayload,
} from 'src/modules/auth/domain/auth.types';
import { AUTH_SERVICE_ADAPTOR } from './../../../user.di-tokens';
import { UserEntity } from '../../../domain/user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignUpCommand } from './sign-up.command';
import { USER_REPOSITORY } from 'src/modules/user/user.di-tokens';
import { UserRepositoryPort } from 'src/modules/user/database/user.repository.port';
import { UserMapper } from 'src/modules/user/mapper/user.mapper';
import { AuthServicePort } from 'src/modules/user/auth/auth.service.port';
import { REFRESH_TOKEN_REPOSITORY } from 'src/modules/auth/auth.di-tokens';
import { RefreshTokenRepositoryPort } from 'src/modules/auth/database/refresh-token.repository.port';
import { RefreshTokenEntity } from 'src/modules/auth/domain/refresh-token.entity';
import { DataSource } from 'typeorm';
import { UpdateUserRefreshTokenIdProps } from 'src/modules/user/domain/user.types';

@Injectable()
@CommandHandler(SignUpCommand)
export class SignUpCommandHandler implements ICommandHandler<SignUpCommand> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly _userMapper: UserMapper,
    @Inject(USER_REPOSITORY)
    private readonly _userRepository: UserRepositoryPort,
    @Inject(AUTH_SERVICE_ADAPTOR)
    private readonly _authService: AuthServicePort,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly _refreshTokenRepository: RefreshTokenRepositoryPort,
  ) {}

  async execute(command: SignUpCommand): Promise<any> {
    const { userName, ...signUpData } = command;
    const user = UserEntity.create({ ...signUpData });
    const userId = user.getProps().id as string;

    const accessTokenPayload: AccessTokenPayload = {
      userId,
      userName,
    };
    const accessToken = this._authService.getJwtAccessToken(accessTokenPayload);

    const refreshTokenPayload: RefreshTokenPayload = {
      userId: userId,
    };

    const { refreshToken, cookieOptions } =
      this._authService.getCookiesWithJwtRefreshToken(refreshTokenPayload);

    const hashedRefreshToken = await this._authService.hashRefreshToken(
      refreshToken,
    );
    const createRefreshTokenProps: CreateRefreshTokenProps = {
      hashedRefreshToken,
      userId,
    };

    const refreshTokenEntity = RefreshTokenEntity.create(
      createRefreshTokenProps,
    );

    const refreshTokenId = refreshTokenEntity.getProps().id as string;

    const updateUserRefreshTokenIdProps: UpdateUserRefreshTokenIdProps = {
      refreshTokenId,
    };

    user.updateUserRefreshTokenId(updateUserRefreshTokenIdProps);

    console.log('user: ', user);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      await this._userRepository.insert(user);
      await this._refreshTokenRepository.insert(refreshTokenEntity);

      // await this._authService.insertRefreshToken(createRefreshTokenProps);
      //   const jwtToken = await this.getJwtAccessToken(user.id, userName);

      // todo 여기는 rank 모듈 수정 후 작성
      // todo 랭킹 정보 갱신의 경우, user 엔티티에 add event 메소드 만들어서, user create event 보내고 ranker 도메인에서 eventhandler 작성해서 랭킹 정보 갱신하도록 메시지 보낼 것.
      // todo 근데 트랜잭션 고려해야함. 참고 : https://velog.io/@backtony/Spring-Event-Driven

      //   await this.rankService.checkRanker(userName);

      //   const ranker = await this.rankerProfileRepository.getRankerProfile(
      //     userName,
      //   );

      //   await this.rankerProfileRepository.updateRankerProfile(
      //     userName,
      //     ranker.profileImage,
      //     ranker.blog,
      //     ranker.email,
      //     ranker.company,
      //     ranker.region,
      //     userId,
      //   );
      await queryRunner.commitTransaction();

      return { accessToken, refreshToken, cookieOptions };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      // github user가 아닌 경우 예외처리 -> login 시, user가 아니면 애초에 회원가입으로 넘어오지 않기 때문에 굳이 할 필요 없다.
    } finally {
      await queryRunner.release();
    }
  }
}
