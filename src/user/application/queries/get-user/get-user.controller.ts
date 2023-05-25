import { JwtAuthGuard } from './../../../../auth/guard/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

import {
  Controller,
  Get,
  HttpCode,
  Req,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from '../../user.service';
import { SwaggerGetMyPage } from 'src/swagger/user/GetMyPage.decorator';
import { GetUserResponseDto } from '../../dtos/get-user.response.dto';

// todo MyPage 도메인을 둬야하는가? 혹시 redirect로

@ApiTags('User')
@Controller('user')
export class GetUserController {
  constructor(private readonly userService: UserService) {}

  @SwaggerGetMyPage()
  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getMyPage(@Req() req): Promise<GetUserResponseDto> {
    const userId = req.user.id;
    return await this.userService.getMyPage(userId);
  }
}
