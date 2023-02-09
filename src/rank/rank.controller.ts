import { Controller, Get, Param } from '@nestjs/common';
import { RankService } from './rank.service';

@Controller('ranks')
export class RankController {
  constructor(private rankService: RankService) {}

  @Get('/:userName')
  getRankerDetail(@Param('userName') userName: string) {
    return this.rankService.getRankerDetail(userName);
  }
}
