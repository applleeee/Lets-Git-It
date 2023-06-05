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
import { AuthService } from 'src/modules/auth/auth.service';
import { JwtRefreshGuard } from 'src/modules/auth/guard/jwt-refresh.guard';
import { SwaggerRefresh } from 'src/modules/swagger/auth/refresh.decorator';

@Controller('auth')
@ApiTags('Auth')
export class RefreshController {
  constructor(private readonly _authService: AuthService) {}

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
    // const currentRefreshToken = req.signedCookies.Refresh;
    // const { user } = req;
    // const accessToken = await this.authService.getJwtAccessToken(
    //   user.id,
    //   user.userName,
    // );
    // const refreshTokenRegenerationRequired: boolean =
    //   await this.authService.isRefreshTokenExpirationDateHalfPast(
    //     currentRefreshToken,
    //   );
    // if (refreshTokenRegenerationRequired) {
    //   const { refreshToken, ...cookieOptions } =
    //     await this.authService.getCookiesWithJwtRefreshToken(user.id);
    //   await this.userService.saveRefreshToken(refreshToken, user.id);
    //   res.cookie('Refresh', refreshToken, cookieOptions).json({ accessToken });
    // } else {
    //   res.json({ accessToken });
    // }
  }
}
