import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
import { UpdateMyPageDto } from './dto/mypage.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth('accessToken')
  @HttpCode(HttpStatus.OK)
  async getMyPage(@Req() req) {
    const userId = req.user.id;
    return await this.userService.getMyPage(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  @ApiBearerAuth('accessToken')
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
