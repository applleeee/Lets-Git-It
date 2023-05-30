import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignOutCommand } from './sign-out.command';
import { UserRepository } from 'src/modules/user/database/user.repository';

@Injectable()
@CommandHandler(SignOutCommand)
export class SignOutCommandHandler implements ICommandHandler<SignOutCommand> {
  constructor(private readonly _userRepository: UserRepository) {}
  async execute(command: SignOutCommand): Promise<any> {
    await this._userRepository.deleteUserRefreshToken(command.userId);

    return { message: 'LOG_OUT_COMPLETED' };
  }
}
