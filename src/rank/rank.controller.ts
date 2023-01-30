import { Controller, Get, Param } from '@nestjs/common';
import { RankerProfile } from './entities/ranker_profile.entity';
import { RankService } from './rank.service';

@Controller('rank')
export class RankController {
  constructor(private rankService: RankService) {}

  @Get('/:userName')
  getUserDetail(@Param('userName') userName: string): Promise<RankerProfile> {
    return this.rankService.getUserDetail(userName);
  }
}
