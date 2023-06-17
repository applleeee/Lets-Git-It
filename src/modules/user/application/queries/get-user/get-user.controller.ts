import { ApiTags } from '@nestjs/swagger';

import {
  Controller,
  Get,
  HttpCode,
  Req,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { GetUserResponseDto } from '../../dtos/get-user.response.dto';
import { SwaggerGetMyPage } from 'src/modules/swagger/user/GetMyPage.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
import { User } from 'src/libs/decorator/user.decorator';
import { QueryBus } from '@nestjs/cqrs';
import { GetUserQuery } from './get-user.query';
import { AuthorizedUser } from 'src/modules/auth/domain/auth.types';

// todo MyPage 도메인을 둬야하는가? 혹시 redirect로

@ApiTags('User')
@Controller('user')
export class GetUserController {
  constructor(private readonly _queryBus: QueryBus) {}

  @SwaggerGetMyPage()
  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getMyPage(@User() user: AuthorizedUser): Promise<GetUserResponseDto> {
    const { id: userId } = user;
    const query = new GetUserQuery(userId);
    return await this._queryBus.execute(query);
  }
}
