import { Injectable } from '@nestjs/common';
import { RankerProfile } from '../entities/RankerProfile';
import axios from 'axios';
import { RankerProfileRepository } from './rank_profile.repository';

@Injectable()
export class RankService {
  constructor(private rankRepository: RankerProfileRepository) {}

  async getRankerDetail(userName: string): Promise<RankerProfile> {
    const check = await this.rankRepository.checkRanker(userName);

    if (!check) {
      const { data } = await axios.get(
        `https://api.github.com/users/${userName}`,
      );

      const followingCount = data.following;
      const followersCount = data.followers;

      await this.rankRepository.createRankerProfile(data);

      const stars = await axios.get(
        `https://api.github.com/users/${data.login}/starred`,
      );
      const starsCount = stars.data.length;

      const scoreBasis = await axios.get(
        `https://api.github.com/users/${data.login}/repos`,
      );

      let forkingCount = 0;
      let personalRepoCount = 0;
      let forkedCount = 0;
      let watchersCount = 0;
      scoreBasis.data.forEach((el) => {
        if (el.fork) {
          forkingCount++;
        } else {
          personalRepoCount++;
        }
        forkedCount += el.forks;
        watchersCount += el.watchers_count;
      });
      console.log({
        forkingCount,
        personalRepoCount,
        forkedCount,
        watchersCount,
      });

      await this.rankRepository.resetAllUsers();
      return;
    }

    return await this.rankRepository.getRankerProfile(userName);
  }
}
