import { AuthGuard } from '@nestjs/passport';
import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getMyPage(@Req() req) {
    return await this.userService.getMyPage(req.user.id);
  }

  @Patch()
  @UseGuards(AuthGuard('jwt'))
  async updateMyPage(@Body() body, @Req() req) {
    const userId = req.user.id;
    const { fieldId, careerId } = body;
    await this.userService.updateMyPage(userId, fieldId, careerId);
    return { message: 'USER_INFO_UPDATED' };
  }
}
