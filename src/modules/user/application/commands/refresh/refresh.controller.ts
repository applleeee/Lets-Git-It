import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtRefreshGuard } from 'src/modules/auth/guard/jwt-refresh.guard';
import { SwaggerRefresh } from 'src/modules/swagger/auth/refresh.decorator';
import { RefreshCommand } from './refresh.command';
import { CommandBus } from '@nestjs/cqrs';
import { RefreshInterceptor } from 'src/modules/auth/interceptor/refresh.interceptor';

@Controller('auth')
@ApiTags('Auth')
export class RefreshController {
  constructor(private readonly _commandBus: CommandBus) {}

  /**
   * @author MyeongSeok
   * @description 리프레시 토큰으로 엑세스 토큰을 재발급 받습니다.
   */
  @SwaggerRefresh()
  @UseGuards(JwtRefreshGuard)
  @UseInterceptors(RefreshInterceptor)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() request: Request & { user?: Record<string, unknown> }) {
    const { id, refreshToken } = request.user;

    const command = new RefreshCommand({ id });

    return await this._commandBus.execute(command);
  }
}
