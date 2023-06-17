import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshCommand } from './refresh.command';
import {
  AUTH_SERVICE_ADAPTOR,
  USER_REPOSITORY,
} from 'src/modules/user/user.di-tokens';
import { UserRepositoryPort } from 'src/modules/user/database/user.repository.port';
import { AuthService } from 'src/modules/auth/application/auth.service';
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from 'src/modules/auth/domain/auth.types';
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
    const { id, refreshToken } = command;

    const { name } = await this._userRepository.getUserNameByUserId(id);
    const payload: AccessTokenPayload = { userId: id, userName: name };
    return await this._authService.getJwtAccessToken(payload);
  }
}
