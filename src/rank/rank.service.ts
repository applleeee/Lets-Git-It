import { Injectable } from '@nestjs/common';
import { RankerProfile } from './entities/ranker_profile.entity';
import axios from 'axios';
import { RankerProfileRepository } from './rank_profile.repository';
import { Ranking } from './entities/ranking.entity';
import { Tier } from './entities/tier.entity';

@Injectable()
export class RankService {
  constructor(private rankRepository: RankerProfileRepository) {}

  async getUserDetail(userName: string): Promise<RankerProfile> {
    const rankerProfile = await this.rankRepository.getRankerProfile(userName);

    console.log(rankerProfile);

    if (!rankerProfile) {
      const { data } = await axios.get(
        `https://api.github.com/users/${userName}`,
      );
      await this.rankRepository.createRankerProfile(data);
    }

    return;
  }
}
