import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
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

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @HttpCode(HttpStatus.OK)
  async getMyPage(@Req() req) {
    const userId = req.user.id;
    return await this.userService.getMyPage(userId);
  }

  @UseGuards(AuthGuard('jwt'))
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
