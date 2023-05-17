import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './../auth/guard/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Req,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { MyPageDto, UpdateMyPageDto } from './dto/mypage.dto';
import { SwaggerGetMyPage } from '../swagger/user/GetMyPage.decorator';
import { SwaggerUpdateMyPage } from '../swagger/user/UpdateMyPage.decorator';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @SwaggerGetMyPage()
  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getMyPage(@Req() req): Promise<MyPageDto> {
    const userId = req.user.id;
    return await this.userService.getMyPage(userId);
  }

  @SwaggerUpdateMyPage()
  @UseGuards(JwtAuthGuard)
  @Patch()
  @HttpCode(HttpStatus.CREATED)
  async updateMyPage(@Body() body: UpdateMyPageDto, @Req() req) {
    const userId = req.user.id;
    const partialEntity = {
      fieldId: body.fieldId,
      careerId: body.careerId,
      isKorean: body.isKorean,
    };
    await this.userService.updateMyPage(userId, partialEntity);
    return { message: 'USER_INFO_UPDATED' };
  }
}
