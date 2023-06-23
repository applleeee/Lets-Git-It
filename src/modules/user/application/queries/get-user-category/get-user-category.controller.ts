import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerGetAuthCategory } from 'src/modules/swagger/auth/get-user-category.decorator';
import { QueryBus } from '@nestjs/cqrs';
import { GetUserCategoryQuery } from './get-user-category.query';
import { UserCategoryDto } from '../../dtos/user-category.response.dto';

@Controller('user')
@ApiTags('User')
export class GetUserCategoryController {
  constructor(private readonly _queryBus: QueryBus) {}
  /**
   * @author MyeongSeok
   * @description 회원가입 시 유저의 개인정보 선택지를 제공합니다.
   */
  @SwaggerGetAuthCategory()
  @Get('/category')
  @HttpCode(HttpStatus.OK)
  async getAuthCategory(): Promise<UserCategoryDto> {
    return await this._queryBus.execute(new GetUserCategoryQuery());
  }
}
