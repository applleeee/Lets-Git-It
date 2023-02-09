import { Controller, Get, Param, Query } from '@nestjs/common';
import { RankService } from './rank.service';

@Controller('/ranks')
export class RankController {
  constructor(private rankService: RankService) {}

  @Get('/search')
  async findRanker(@Query('userName') userName: string) {
    return await this.rankService.findRanker(userName);
  }

  @Get('/:userName')
  async getRankerDetail(@Param('userName') userName: string) {
    return await this.rankService.getRankerDetail(userName);
  }
}
