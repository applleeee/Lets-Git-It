import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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

  async execute(command: RefreshCommand): Promise<any> {
    const { id } = command;

    const name = await this._userRepository.getUserNameByUserId(id);

    if (!name) throw new NotFoundException('NO_EXIST_RANKER');

    const payload: AccessTokenPayload = { userId: id, userName: name };

    return this._authService.getJwtAccessToken(payload);
  }
}
