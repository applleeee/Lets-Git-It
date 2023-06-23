import { User } from '../../../../../libs/decorator/user.decorator';
import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { SignOutCommand } from './sign-out.command';
import { SwaggerSignOut } from 'src/modules/swagger/auth/sing-out.decorator';
import { JwtRefreshGuard } from 'src/modules/auth/guard/jwt-refresh.guard';
import { AuthorizedUser } from 'src/modules/auth/domain/auth.types';
import { Response } from 'express';

@Controller('user')
@ApiTags('User')
export class SignOutController {
  constructor(private readonly _commandBus: CommandBus) {}

  /**
   * @author MyeongSeok
   * @description 로그아웃
   */
  @SwaggerSignOut()
  @UseGuards(JwtRefreshGuard)
  @Post('/sign-out')
  @HttpCode(HttpStatus.OK)
  async signOut(
    @User() user: Partial<AuthorizedUser>,
    @Res({ passthrough: true }) res: Response,
  ) {
    const message = await this._commandBus.execute(new SignOutCommand(user.id));

    res.cookie('Refresh', null, { expires: new Date(0) }).json(message);
  }
}
