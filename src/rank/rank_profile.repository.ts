import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RankerProfile } from './entities/ranker_profile.entity';
import { Ranking } from './entities/ranking.entity';
import { Tier } from './entities/tier.entity';

@Injectable()
export class RankerProfileRepository {
  constructor(
    @InjectRepository(RankerProfile)
    private rankerProfileRepository: Repository<RankerProfile>,
  ) {}

  async getRankerProfile(name: string) {
    const { id } = await this.rankerProfileRepository.findOne({
      where: { name },
    });
    const rankerProfile = await this.rankerProfileRepository
      .createQueryBuilder()
      .select('*')
      .leftJoin(Ranking, `r`, 'RankerProfile.id = r.ranker_profile_id')
      .leftJoin(Tier, `t`, `t.id=r.tier_id`)
      .where(`RankerProfile.id=:id`, { id })
      .getRawOne();

    return rankerProfile;
  }

  async createRankerProfile(data) {
    await this.rankerProfileRepository
      .createQueryBuilder()
      .insert()
      .into(RankerProfile)
      .values([
        {
          name: data['login'],
          profile_image_url: data['avatar_url'],
          profile_text: data['bio'],
          homepage_url: data['blog'],
          email: data['email'],
          company: data['company'],
          region: data['location'],
        },
      ])
      .execute();
  }
}
