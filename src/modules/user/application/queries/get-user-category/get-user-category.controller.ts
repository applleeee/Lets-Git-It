import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthCategoryOkDto } from '../../dtos/get-user-category.response.dto';
import { AuthService } from 'src/modules/auth/auth.service';
import { SwaggerGetAuthCategory } from 'src/modules/swagger/auth/get-user-category.decorator';

@Controller('user')
@ApiTags('User')
export class GetUserCategoryController {
  constructor(private readonly authService: AuthService) {}
  /**
   * @author MyeongSeok
   * @description 회원가입 시 유저의 개인정보 선택지를 제공합니다.
   */
  @SwaggerGetAuthCategory()
  @Get('/category')
  @HttpCode(HttpStatus.OK)
  getAuthCategory(): Promise<AuthCategoryOkDto> {
    return this.authService.getAuthCategory();
  }
}
