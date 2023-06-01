import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignOutCommand } from './sign-out.command';
import { UserRepositoryPort } from 'src/modules/user/database/user.repository.port';
import { USER_REPOSITORY } from 'src/modules/user/user.di-tokens';

@Injectable()
@CommandHandler(SignOutCommand)
export class SignOutCommandHandler implements ICommandHandler<SignOutCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly _userRepository: UserRepositoryPort,
  ) {}

  async execute(command: SignOutCommand): Promise<any> {
    await this._userRepository.deleteUserRefreshToken(command.userId);

    return { message: 'LOG_OUT_COMPLETED' };
  }
}
