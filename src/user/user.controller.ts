import { AuthGuard } from '@nestjs/passport';
import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateMyPageDto } from './dto/mypage.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getMyPage(@Req() req) {
    return { data: await this.userService.getMyPage(req.user.id) };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch()
  async updateMyPage(@Body() body: UpdateMyPageDto, @Req() req) {
    const userId = req.user.id;
    const partialEntity = { fieldId: body.fieldId, careerId: body.careerId };
    await this.userService.updateMyPage(userId, partialEntity);
    return { message: 'USER_INFO_UPDATED' };
  }
}
