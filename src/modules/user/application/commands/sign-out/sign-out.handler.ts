import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignOutCommand } from './sign-out.command';
import { USER_REPOSITORY } from 'src/modules/user/user.di-tokens';
import { RefreshTokenRepositoryPort } from 'src/modules/auth/database/refresh-token.repository.port';

@Injectable()
@CommandHandler(SignOutCommand)
export class SignOutCommandHandler implements ICommandHandler<SignOutCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly _refreshTokenRepository: RefreshTokenRepositoryPort,
  ) {}

  async execute(command: SignOutCommand): Promise<any> {
    await this._refreshTokenRepository.deleteUserRefreshToken(command.userId);

    return { message: 'LOG_OUT_COMPLETED' };
  }
}
