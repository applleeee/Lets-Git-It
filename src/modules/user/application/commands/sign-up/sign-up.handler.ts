import { UserEntity } from '../../../domain/user.entity';
import { UserRepository } from '../../../database/repository/user.repository';
import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignUpCommand } from './sign-up.command';
import { USER_REPOSITORY } from 'src/modules/user/user.di-tokens';
import { UserRepositoryPort } from 'src/modules/user/database/user.repository.port';
import { UserMapper } from 'src/modules/user/mapper/user.mapper';

@Injectable()
@CommandHandler(SignUpCommand)
export class SignUpCommandHandler implements ICommandHandler<SignUpCommand> {
  constructor(
    private readonly _mapper: UserMapper,
    @Inject(USER_REPOSITORY)
    private readonly _userRepository: UserRepositoryPort,
  ) {}
  async execute(command: SignUpCommand): Promise<any> {
    const { userName, ...signUpData } = command;
    const user = UserEntity.create({ ...signUpData });

    await this._userRepository.insert(user);

    const userDto = this._mapper.toResponse(user);

    // todo authService이용해서 jwt access token, refresh token 만들기

    // todo refreshtoken user에 넣어주고 db 저장
    //   const jwtToken = await this.getJwtAccessToken(user.id, userName);

    // todo

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

    //   return { accessToken: jwtToken, userId: user.id };
    // }
    return;
  }
}
