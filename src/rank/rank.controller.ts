import { Controller, Get, Param } from '@nestjs/common';
import { RankService } from './rank.service';

@Controller('rank')
export class RankController {
  constructor(private rankService: RankService) {}

  @Get('/:userName')
  getRankerDetail(@Param('userName') userName: string) {
    return this.rankService.getRankerDetail(userName);
  }
}
