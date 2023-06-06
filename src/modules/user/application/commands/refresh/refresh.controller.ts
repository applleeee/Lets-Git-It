import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtRefreshGuard } from 'src/modules/auth/guard/jwt-refresh.guard';
import { SwaggerRefresh } from 'src/modules/swagger/auth/refresh.decorator';
import { RefreshCommand } from './refresh.command';
import { CommandBus } from '@nestjs/cqrs';

@Controller('auth')
@ApiTags('Auth')
export class RefreshController {
  constructor(private readonly _commandBus: CommandBus) {}

  /**
   * @author MyeongSeok
   * @description 리프레시 토큰으로 엑세스 토큰을 재발급 받습니다.
   * todo uri와 method restful하게 수정 필요. -> post
   */
  @SwaggerRefresh()
  @UseGuards(JwtRefreshGuard)
  @Get('/refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.signedCookies.Refresh;
    const { id } = req.user;

    const command = new RefreshCommand({ id, refreshToken });
    return await this._commandBus.execute(command);
  }
}
