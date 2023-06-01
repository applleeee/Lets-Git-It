import { GithubUser } from '../../../../github-api/github-user';
import { GithubService } from '../../../../github-api/github.service';
import { UserRepository } from '../../../database/repository/user.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignInCommand } from './sign-in.command';
import { Inject, Injectable } from '@nestjs/common';
import { response } from 'express';
import { USER_REPOSITORY } from 'src/modules/user/user.di-tokens';
import { UserRepositoryPort } from 'src/modules/user/database/user.repository.port';

@Injectable()
@CommandHandler(SignInCommand)
export class SignInCommandHandler implements ICommandHandler<SignInCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly _userRepository: UserRepositoryPort,
    private readonly _githubService: GithubService, // todo private readonly port 삽입
  ) {}
  async execute(command: SignInCommand): Promise<any> {
    // todo 유저라면 엑세스 토큰,userId를 포함한 유저정보, 아니라면 githubId를 포함한 유저정보 반환
    const { code } = command;

    const githubAccessToken = await this._githubService.getGithubAccessToken(
      code,
    );

    const githubUser: GithubUser =
      await this._githubService.getGithubUserByGithubAccessToken(
        githubAccessToken,
      );

    console.log('githubUser: ', githubUser);
    const user = await this._userRepository.getUserByGithubId(githubUser.id);

    // todo 회원이 아니라면 회원 정보 리턴 -> 이걸 바로 그냥 회원가입으로 넘기는것은 어떤가.
    return response.redirect('/sign-up');
    // if (!userInfo.isMember) {
    //   res
    //     .status(HttpStatus.UNAUTHORIZED)
    //     .json(userInfo as AuthSignInUnauthorizedResDto);
    // }
    // todo 유저라면
    // todo jwt 토큰 제작 - auth service
    // todo 리프레시 토큰 제작 - auth service
    // todo 리프레시 토큰 db 저장
    // else {
    //   const { userId, ...accessTokenWithUserInfo } = userInfo;

    //   const { refreshToken, ...cookieOptions } =
    //     await this.authService.getCookiesWithJwtRefreshToken(userId);

    //   await this.userService.saveRefreshToken(refreshToken, userId);

    // todo 리프레시 토큰 쿠키와 엑세스토큰 리턴
    //   res
    //     .cookie('Refresh', refreshToken, cookieOptions)
    //     .json(accessTokenWithUserInfo as AuthSignInOkResDto);
    // }

    // todo mapper로 dto로 만들어서 반환.

    return;
  }
}
