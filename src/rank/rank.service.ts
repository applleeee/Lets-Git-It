import { Injectable } from '@nestjs/common';
import { RankerProfile } from './entities/ranker_profile.entity';
import { default as axios } from 'axios';

@Injectable()
export class RankService {
  async getUserDetail(userName: string): Promise<RankerProfile> {
    const { data } = await axios.get(
      `https://api.github.com/users/${userName}`,
    );
    console.log(data);

    return;
  }
}
