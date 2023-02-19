import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { RankerProfileRepository } from './rankerProfile.repository';
import * as dotenv from 'dotenv';
import { TierRepository } from './tier.repository';
import { RankingRepository } from './ranking.repository';
import { SearchOutput, Top100, Top5 } from './dto/rankerProfile.dto';

dotenv.config();

const TOKEN = process.env.GITHUB_ACCESS_TOKEN;

@Injectable()
export class RankService {
  constructor(
    private rankerProfileRepository: RankerProfileRepository,
    private rankingRepository: RankingRepository,
    private tierRepository: TierRepository,
  ) {}

  async checkRanker(userName: string) {
    const check = await this.rankerProfileRepository.checkRanker(userName);

    if (check) {
      const rankerDetail = await this.rankerProfileRepository.getRankerProfile(
        userName,
      );
      rankerDetail['blank'] = null;
      const maxValues = await this.rankingRepository.getMaxValues();
      const avgValues = await this.rankingRepository.getAvgValues();
      return { rankerDetail, maxValues, avgValues };
    }

    return this.getRankerDetail(userName);
  }

  async getRankerDetail(userName: string) {
    try {
      const users = axios
        .get(`https://api.github.com/users/${userName}`, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        })
        .catch((e) => {
          throw new HttpException('INVALID USER', HttpStatus.NOT_FOUND);
        });

      const stars = axios.get(
        `https://api.github.com/users/${userName}/starred?per_page=100`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        },
      );

      const issues = axios.get(
        `https://api.github.com/search/issues?q=author:${userName}`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        },
      );

      const pullRequest = axios.get(
        `https://api.github.com/search/issues?q=type:pr+author:${userName}`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        },
      );
      const eventList = axios.get(
        `https://api.github.com/users/${userName}/events?per_page=100`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        },
      );

      const commits = axios.get(
        `https://api.github.com/search/commits?q=author:${userName}`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        },
      );

      const [
        issuesRes,
        pullRequestRes,
        usersRes,
        starsRes,
        eventListRes,
        commitsRes,
      ] = await Promise.all([
        issues,
        pullRequest,
        users,
        stars,
        eventList,
        commits,
      ]);

      const checkRanker = await this.rankerProfileRepository.checkRanker(
        userName,
      );

      if (checkRanker) {
        await this.rankerProfileRepository.getLatestRankerData(usersRes.data);
      } else {
        await this.rankerProfileRepository.createRankerProfile(usersRes.data);
      }

      const starringCount = starsRes.data.length;
      const followingCount = usersRes.data.following;
      const followersCount = usersRes.data.followers;
      const pullRequestCount = pullRequestRes.data.total_count;
      const issuesCount = issuesRes.data.total_count - pullRequestCount;
      const commitsCount = commitsRes.data.total_count;

      const promises = [];
      const allPR = pullRequestRes.data.items;

      for (let i = 0; i < allPR.length; i++) {
        if (allPR[i].author_association === 'CONTRIBUTOR') {
          promises.push(
            axios.get(allPR[i].repository_url, {
              headers: {
                Authorization: `Bearer ${TOKEN}`,
              },
            }),
          );
        }
      }

      const contributingRepos = await Promise.all(promises);

      let contributingRepoStarsCount = 0;

      for (const repo of contributingRepos) {
        contributingRepoStarsCount += repo.data.stargazers_count;
      }

      const reviews = eventListRes.data.filter(
        (event: object) => event['type'] === 'PullRequestReviewEvent',
      );

      const reviewCount = reviews.length;

      const sponsors = await axios.get(
        `https://ghs.vercel.app/count/${userName}`,
      );

      let sponsorsCount = 0;

      if (!Boolean(sponsors.data)) {
        const sponsorsList = await axios.get(
          `https://ghs.vercel.app/sponsors/${userName}`,
        );
        sponsorsCount = sponsorsList.data.sponsors.length;
      }

      const scoreBasisPromise = axios.get(
        `https://api.github.com/users/${userName}/repos?per_page=100`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        },
      );

      const reposLangPromises = [];
      const scoreBasis = await scoreBasisPromise;
      const programmingLang = new Object();
      let forkingCount = 0;
      let personalRepoCount = 0;
      let forkedCount = 0;
      let watchersCount = 0;
      let myStarsCount = 0;

      for (const el of scoreBasis.data) {
        const repoName = el.name;

        if (!el.fork) {
          personalRepoCount++;
          reposLangPromises.push(
            axios.get(
              `https://api.github.com/repos/${userName}/${repoName}/languages`,
              {
                headers: {
                  Authorization: `Bearer ${TOKEN}`,
                },
              },
            ),
          );
        } else {
          forkingCount++;
        }
        myStarsCount += el.stargazers_count;
        forkedCount += el.forks;
        watchersCount += el.watchers_count;
      }

      const reposLangArray = await Promise.all(reposLangPromises);
      for (const reposLang of reposLangArray) {
        const languages: object = reposLang.data;
        for (const lang in languages) {
          if (programmingLang.hasOwnProperty(lang)) {
            programmingLang[lang] += languages[lang];
          } else {
            programmingLang[lang] = languages[lang];
          }
        }
      }

      const maxBit = Math.max(...Object.values(programmingLang));

      const mainLanguage =
        maxBit > 0
          ? Object.keys(programmingLang).find(
              (key) => programmingLang[key] === maxBit,
            )
          : 'none';

      const curiosityScore =
        (issuesCount * 5 +
          forkingCount * 4 +
          starringCount * 2 +
          followingCount * 1) *
        0.1;
      const passionScore =
        (commitsCount * 5 +
          pullRequestCount * 4 +
          reviewCount * 2 +
          personalRepoCount * 1) *
        0.2;
      const fameScore =
        (followersCount * 5 + forkedCount * 4 + watchersCount * 3) * 0.35;
      const abilityScore =
        (sponsorsCount * 5 +
          myStarsCount * 4 +
          contributingRepoStarsCount * 3) *
        0.35;

      const totalScore = Math.floor(
        curiosityScore + passionScore + fameScore + abilityScore,
      );

      const tierData = await this.tierRepository.getTierData();
      const scores = await this.rankingRepository.getAllScores();

      const ranking = scores
        .map((el) => parseFloat(el.total_score))
        .concat(totalScore)
        .sort((a, b) => b - a);

      const percentile =
        ((ranking.indexOf(totalScore) + 1) / ranking.length) * 100;

      let tierId = 0;
      for (const t of tierData) {
        if (
          percentile > parseFloat(t.endPercent) &&
          percentile <= parseFloat(t.startPercent)
        ) {
          tierId = t.id;
        }
      }
      const rankerProfileId = await this.rankerProfileRepository.getRankerId(
        userName,
      );
      const checkRanking = await this.rankingRepository.checkRanking(
        rankerProfileId,
      );

      if (checkRanking) {
        await this.rankingRepository.updateRanking(
          mainLanguage,
          curiosityScore,
          passionScore,
          fameScore,
          abilityScore,
          totalScore,
          issuesCount,
          forkingCount,
          starringCount,
          followingCount,
          commitsCount,
          pullRequestCount,
          reviewCount,
          personalRepoCount,
          followersCount,
          forkedCount,
          watchersCount,
          sponsorsCount,
          myStarsCount,
          contributingRepoStarsCount,
          rankerProfileId,
          tierId,
        );
      } else {
        await this.rankingRepository.registerRanking(
          mainLanguage,
          curiosityScore,
          passionScore,
          fameScore,
          abilityScore,
          totalScore,
          issuesCount,
          forkingCount,
          starringCount,
          followingCount,
          commitsCount,
          pullRequestCount,
          reviewCount,
          personalRepoCount,
          followersCount,
          forkedCount,
          watchersCount,
          sponsorsCount,
          myStarsCount,
          contributingRepoStarsCount,
          rankerProfileId,
          tierId,
        );
      }

      const rankerDetail = await this.rankerProfileRepository.getRankerProfile(
        userName,
      );
      const maxValues = await this.rankingRepository.getMaxValues();
      const avgValues = await this.rankingRepository.getAvgValues();
      return { rankerDetail, maxValues, avgValues };
    } catch (e) {
      throw new HttpException(
        'GITHUB API IS OVERLOADED',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async getTop5(): Promise<Top5[]> {
    return await this.rankerProfileRepository.getTop5();
  }

  async getTop100(langFilter: unknown): Promise<{
    langCategory: unknown[];
    top100: Top100[];
  }> {
    let lang = '';
    if (langFilter === 'All') {
      lang = `IS NOT NULL`;
    } else if (typeof langFilter === 'string') {
      lang = `= '${langFilter}'`;
    } else {
      lang = `IS NOT NULL`;
    }

    const top100 = await this.rankerProfileRepository.getTop100(lang);

    const top100Lang = await this.rankingRepository.getTop100Languages();

    const mainLanguages = new Set();

    top100Lang.forEach((el) => mainLanguages.add(el.main_language));

    const langCategory: string | unknown[] = Array.from(mainLanguages);

    return { langCategory, top100 };
  }

  async findRanker(userName: string): Promise<SearchOutput[]> {
    return await this.rankerProfileRepository.findRanker(userName);
  }
}
