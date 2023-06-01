import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from './update-user.command';
import { USER_REPOSITORY } from 'src/modules/user/user.di-tokens';
import { UserRepositoryPort } from 'src/modules/user/database/user.repository.port';

@CommandHandler(UpdateUserCommand)
@Injectable()
export class UpDateUserCommandHandler
  implements ICommandHandler<UpdateUserCommand>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly _userRepository: UserRepositoryPort,
  ) {}

  async execute(command: UpdateUserCommand): Promise<any> {
    const { id, ...props } = command;
    const user = await this._userRepository.findOneById(id);

    user.update(props);

    await this._userRepository.update(user);

    return { message: 'USER_INFO_UPDATED' };
  }
}
