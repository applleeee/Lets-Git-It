import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshCommand } from './refresh.command';
import {
  AUTH_SERVICE_ADAPTOR,
  USER_REPOSITORY,
} from 'src/modules/user/user.di-tokens';
import { UserRepositoryPort } from 'src/modules/user/database/user.repository.port';
import { AccessTokenPayload } from 'src/modules/auth/domain/auth.types';
import { AuthServicePort } from 'src/modules/user/auth/auth.service.port';

@Injectable()
@CommandHandler(RefreshCommand)
export class RefreshCommandHandler implements ICommandHandler<RefreshCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly _userRepository: UserRepositoryPort,
    @Inject(AUTH_SERVICE_ADAPTOR)
    private readonly _authService: AuthServicePort,
  ) {}

  // todo auth 모듈 정비 끝나면, refreshToken 발급 받는 로직 하나로 감싸고, res 분기 처리해서 내보내는 것 처리
  async execute(command: RefreshCommand): Promise<any> {
    const { id } = command;

    // todo 현재 랭커 정보가 db에 없어서 username을 가져오지 못하기 때문에 name이 null임
    const { name } = await this._userRepository.getUserNameByUserId(id);
    const payload: AccessTokenPayload = { userId: id, userName: name };
    return this._authService.getJwtAccessToken(payload);
  }
}
