import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  HttpCode,
  Patch,
  Req,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from '../../user.service';

import { UpdateUserDto } from './update-user.request.dto';
import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
import { SwaggerUpdateMyPage } from 'src/modules/swagger/user/UpdateMyPage.decorator';

@ApiTags('User')
@Controller('user')
export class UpdateUserController {
  constructor(private readonly userService: UserService) {}

  @SwaggerUpdateMyPage()
  @UseGuards(JwtAuthGuard)
  @Patch()
  @HttpCode(HttpStatus.CREATED)
  async updateUser(@Body() body: UpdateUserDto, @Req() req) {
    const userId = req.user.id;
    const partialEntity = {
      fieldId: body.fieldId,
      careerId: body.careerId,
      isKorean: body.isKorean,
    };
    await this.userService.updateUser(userId, partialEntity);
    return { message: 'USER_INFO_UPDATED' };
  }
}
