import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignOutCommand } from './sign-out.command';
import { RefreshTokenRepositoryPort } from 'src/modules/auth/database/refresh-token.repository.port';
import { REFRESH_TOKEN_REPOSITORY } from 'src/modules/auth/auth.di-tokens';

@Injectable()
@CommandHandler(SignOutCommand)
export class SignOutCommandHandler implements ICommandHandler<SignOutCommand> {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly _refreshTokenRepository: RefreshTokenRepositoryPort,
  ) {}

  async execute(command: SignOutCommand) {
    const refreshTokenEntity =
      await this._refreshTokenRepository.findOneByUserId(command.userId);

    const result = await this._refreshTokenRepository.softDelete(
      refreshTokenEntity,
    );

    if (!result) throw new BadRequestException('SIGN_OUT_FAILED');

    return { message: 'LOG_OUT_COMPLETED' };
  }
}
