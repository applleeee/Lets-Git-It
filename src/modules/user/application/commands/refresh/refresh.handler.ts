import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshCommand } from './refresh.command';
import { USER_REPOSITORY } from 'src/modules/user/user.di-tokens';
import { UserRepositoryPort } from 'src/modules/user/database/user.repository.port';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
@CommandHandler(RefreshCommand)
export class RefreshCommandHandler implements ICommandHandler<RefreshCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly _userRepository: UserRepositoryPort,
    private readonly _authService: AuthService,
  ) {}

  // todo auth 모듈 정비 끝나면, refreshToken 발급 받는 로직 하나로 감싸고, res 분기 처리해서 내보내는 것 처리
  async execute(command: RefreshCommand): Promise<any> {
    const { id, refreshToken } = command;

    const { name } = await this._userRepository.getUserNameByUserId(id);

    const accessToken = await this._authService.getJwtAccessToken(id, name);

    const refreshTokenRegenerationRequired: boolean =
      await this._authService.isRefreshTokenExpirationDateHalfPast(
        refreshToken,
      );
    if (refreshTokenRegenerationRequired) {
      const { refreshToken, ...cookieOptions } =
        await this._authService.getCookiesWithJwtRefreshToken(id);
      await this._authService.saveRefreshToken(refreshToken, id);
      // res.cookie('Refresh', refreshToken, cookieOptions).json({ accessToken });
    } else {
      // res.json({ accessToken });
    }
  }
}
