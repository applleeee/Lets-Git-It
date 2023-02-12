import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RankerProfile } from '../entities/RankerProfile';
import { Ranking } from '../entities/Ranking';
import { Tier } from '../entities/Tier';
import { RankService } from './rank.service';

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
      where: { name },
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
      .select([
        'RankerProfile.id as rankerId',
        'RankerProfile.name as rankerName',
        'RankerProfile.profile_image_url as profileImage',
        'RankerProfile.homepage_url as blog',
        'RankerProfile.email as email',
        'RankerProfile.company as company',
        'RankerProfile.region as region',
        'r.main_language as mainLang',
        'r.curiosity_score as curiosityScore',
        'r.passion_score as passionScore',
        'r.fame_score as fameScore',
        'r.ability_score as abilityScore',
        'r.total_score as totalScore',
        'r.curiosity_raise_issue_number as issueNumber',
        'r.curiosity_fork_repository_number as forkingNumber',
        'r.curiosity_give_star_repository_number as starringNumber',
        'r.curiosity_following_number as followingNumber',
        'r.passion_commit_number as commitNumber',
        'r.passion_pr_number as prNumber',
        'r.passion_review_number as reviewNumber',
        'r.passion_create_repository_number as personalRepoNumber',
        'r.fame_follower_number as followerNumber',
        'r.fame_repository_forked_number as forkedNumber',
        'r.fame_repository_watched_number as watchedNumber',
        'r.ability_sponsered_number as sponsorNumber',
        'r.ability_contribute_repository_star_number as contributingRepoStarNumber',
        'r.ability_public_repository_star_number as myStarNumber',
        't.name as tier',
        't.image_url as tierImage',
      ])
      .leftJoin(Ranking, `r`, 'RankerProfile.id = r.ranker_profile_id')
      .leftJoin(Tier, `t`, `t.id=r.tier_id`)
      .where(`RankerProfile.id=:id`, { id })
      .getRawOne();

    return rankerProfile;
  }

  async getTop5() {
    const top5 = await this.rankerProfileRepository
      .createQueryBuilder()
      .select([
        'RankerProfile.name as rankerName',
        'RankerProfile.profile_image_url as profileImage',
        'ROUND(ranking.total_score,0) as totalScore',
      ])
      .leftJoin(
        Ranking,
        'ranking',
        'ranking.ranker_profile_id=RankerProfile.id',
      )
      .orderBy('totalScore', 'DESC')
      .limit(5)
      .getRawMany();
    return top5;
  }

  async getTop100(lang: string) {
    const top100 = await this.rankerProfileRepository
      .createQueryBuilder()
      .select([
        'RankerProfile.name as userName',
        'r.main_language as mainLang',
        'r.fame_follower_number as followerNumber',
        'r.ability_public_repository_star_number as myStarNumber',
        'r.passion_commit_number as commitNumber',
        'r.total_score as totalScore',
        't.name as tier',
        't.image_url as tierImage',
      ])
      .leftJoin(Ranking, 'r', 'r.ranker_profile_id = RankerProfile.id')
      .leftJoin(Tier, 't', 't.id = r.tier_id')
      .where(`r.main_language ${lang}`)
      .orderBy('totalScore', 'DESC')
      .limit(100)
      .getRawMany();

    return top100;
  }
  async findRanker(userName) {
    const ranker = await this.rankerProfileRepository
      .createQueryBuilder()
      .select([
        'RankerProfile.name as rankerName',
        'RankerProfile.profile_image_url as profileImage',
        't.image_url as tierImage',
      ])
      .leftJoin(Ranking, `r`, 'RankerProfile.id = r.ranker_profile_id')
      .leftJoin(Tier, `t`, `t.id=r.tier_id`)
      .where('RankerProfile.name LIKE :rankerName', {
        rankerName: `%${userName}%`,
      })
      .getRawMany();

    return ranker;
  }

  async getMyPage(userId: number) {
    //todo 추후에 auth 로직에서 해당 유저의 ranker profile 정보가 없을 경우 현상님의 로직을 사용해서 회원 가입 시 애초애 정보를 등록하는 과정으로 리펙토링 하겠습니다.

    let result;
    const ranker = await this.rankerProfileRepository.findBy({
      userId: userId,
    })[0];
    if (!ranker) {
      result = {
        userName: '랭킹 정보를 검색해주세요!',
        profileText: '랭킹 정보를 검색해주세요!',
        profileImageUrl: '랭킹 정보를 검색해주세요!',
        email: '랭킹 정보를 검색해주세요!',
      };
    } else {
      result = ranker;
    }
    console.log('ranker: ', result);
    return result;
  }
}
