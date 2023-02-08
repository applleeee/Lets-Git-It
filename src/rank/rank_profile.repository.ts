import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RankerProfile } from '../entities/RankerProfile';
import { Ranking } from '../entities/Ranking';
import { Tier } from '../entities/Tier';

@Injectable()
export class RankerProfileRepository {
  constructor(
    @InjectRepository(RankerProfile)
    private rankerProfileRepository: Repository<RankerProfile>,
  ) {}

  async checkRanker(name: string): Promise<boolean> {
    return await this.rankerProfileRepository.exist({ where: { name } });
  }

  async getRankerId(name: string): Promise<number> {
    const { id } = await this.rankerProfileRepository.findOne({
      where: { name: name },
    });
    return id;
  }

  async createRankerProfile(data: RankerProfile): Promise<void> {
    await this.rankerProfileRepository
      .createQueryBuilder()
      .insert()
      .into(RankerProfile)
      .values([
        {
          name: data['login'],
          profileImageUrl: data['avatar_url'],
          profileText: data['bio'],
          homepageUrl: data['blog'],
          email: data['email'],
          company: data['company'],
          region: data['location'],
        },
      ])
      .execute();
  }

  async getRankerProfile(name: string) {
    const { id } = await this.rankerProfileRepository.findOne({
      where: { name },
    });
    const rankerProfile = await this.rankerProfileRepository
      .createQueryBuilder()
      .leftJoin(Ranking, `r`, 'RankerProfile.id = r.ranker_profile_id')
      .addSelect(`r`)
      .leftJoin(Tier, `t`, `t.id=r.tier_id`)
      .addSelect([`t.name`, `t.image_url`])
      .where(`RankerProfile.id=:id`, { id })
      .getRawOne();

    return rankerProfile;
  }
}
