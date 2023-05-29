import { JwtRefreshGuard } from './../../../../auth/guard/jwt-refresh.guard';
import { UserService } from './../../user.service';

import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { SwaggerSignOut } from 'src/swagger/auth/sing-out.decorator';

@Controller('user')
@ApiTags('User')
export class SignOutController {
  constructor(private readonly userService: UserService) {}

  /**
   * @author MyeongSeok
   * @description 로그아웃
   */
  @SwaggerSignOut()
  @UseGuards(JwtRefreshGuard)
  @Post('/sign-out')
  @HttpCode(HttpStatus.OK)
  async signOut(@Req() req, @Res({ passthrough: true }) res: Response) {
    await this.userService.deleteRefreshToken(req.user.id);
    res.cookie('Refresh', null, { expires: new Date(0) });
    return { message: 'LOG_OUT_COMPLETED' };
  }
}
