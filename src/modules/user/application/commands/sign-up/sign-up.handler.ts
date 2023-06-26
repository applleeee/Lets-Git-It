import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from './../../../../auth/domain/auth.types';
import { SignUpCreatedDto } from './../../dtos/sign-up.response.dto';
import { AUTH_SERVICE_ADAPTOR } from './../../../user.di-tokens';
import { UserEntity } from '../../../domain/user.entity';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignUpCommand } from './sign-up.command';
import { UserMapper } from 'src/modules/user/mapper/user.mapper';
import { AuthServicePort } from 'src/modules/user/auth/auth.service.port';
import { RefreshTokenEntity } from 'src/modules/auth/domain/refresh-token.entity';
import { DataSource } from 'typeorm';
import { RefreshTokenMapper } from 'src/modules/auth/mapper/refresh-token.mapper';
import { User } from 'src/modules/user/database/entity/user.orm-entity';
import { RefreshToken } from 'src/modules/auth/database/refresh-token.orm-entity';

@Injectable()
@CommandHandler(SignUpCommand)
export class SignUpCommandHandler implements ICommandHandler<SignUpCommand> {
  constructor(
    private readonly _dataSource: DataSource,
    private readonly _userMapper: UserMapper,
    private readonly _refreshTokenMapper: RefreshTokenMapper,
    @Inject(AUTH_SERVICE_ADAPTOR)
    private readonly _authService: AuthServicePort,
  ) {}

  async execute(command: SignUpCommand): Promise<any> {
    const { userName, ...signUpData } = command;

    const userEntity = UserEntity.create({ ...signUpData });
    const userId = userEntity.getProps().id as string;

    const { accessToken } = this._authService.getJwtAccessToken({
      userId,
      userName,
    });

    const { refreshToken, cookieOptions } =
      this._authService.getCookiesWithJwtRefreshToken({
        userId: userId,
      });

    const hashedRefreshToken = await this._authService.hashRefreshToken(
      refreshToken,
    );

    const refreshTokenEntity = RefreshTokenEntity.create({
      hashedRefreshToken,
      userId,
    });

    const userOrmEntity = this.updateUserOrmEntity(
      userEntity,
      refreshTokenEntity,
    );

    const refreshTokenOrmEntity =
      this._refreshTokenMapper.toPersistence(refreshTokenEntity);

    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.insert(User, userOrmEntity);
      await queryRunner.manager.insert(RefreshToken, refreshTokenOrmEntity);

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

      const signUpCreatedDto = new SignUpCreatedDto(accessToken);

      return { signUpCreatedDto, refreshToken, cookieOptions };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(`USER_ALREADY_EXIST`);
      } else {
        throw new BadRequestException('SIGN_UP_FAILED');
      }
    } finally {
      await queryRunner.release();
    }
  }

  private updateUserOrmEntity(
    userEntity: UserEntity,
    refreshTokenEntity: RefreshTokenEntity,
  ) {
    const refreshTokenId = refreshTokenEntity.getProps().id as string;

    userEntity.updateUserRefreshTokenId({
      refreshTokenId,
    });

    return this._userMapper.toPersistence(userEntity);
  }
}
