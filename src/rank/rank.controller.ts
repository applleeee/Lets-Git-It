import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OptionalAuthGuard } from 'src/community/guard/optionalGuard';
import { SearchOutput, Top100, Top5 } from './dto/rankerProfile.dto';
import { RankService } from './rank.service';

@Controller('/ranks')
export class RankController {
  constructor(private rankService: RankService) {}

  @Get('/search')
  async findRanker(
    @Query('userName') userName: string,
  ): Promise<SearchOutput[]> {
    return await this.rankService.findRanker(userName);
  }

  @Get('/versus')
  async compareRanker(@Query('userName') userName: string[]) {
    const firstUser = await this.rankService.checkRanker(userName[0]);
    const secondUser = await this.rankService.checkRanker(userName[1]);
    return { firstUser, secondUser };
  }

  @Get('/:userName')
  async getRankerDetail(@Param('userName') userName: string) {
    return await this.rankService.checkRanker(userName);
  }

  @Get('/ranking/top5')
  async getTop5(): Promise<Top5[]> {
    return await this.rankService.getTop5();
  }

  @UseGuards(OptionalAuthGuard)
  @Get('/ranking/top100')
  async getTop100(
    @Query('langFilter') langFilter: string,
    @Req() req,
  ): Promise<{
    langCategory: unknown[];
    top100: Top100[];
  }> {
    if (!req.user) {
      return await this.rankService.getTop100(langFilter);
    } else {
    }
  }

  @Patch('/latest/:userName')
  async updateRankerProfile(@Param('userName') userName: string) {
    await this.rankService.getRankerDetail(userName);
    return { URL: `/userDetail/${userName}` };
  }
}
