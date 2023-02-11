import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { RankerProfileRepository } from './rank_profile.repository';
import * as dotenv from 'dotenv';
import { TierRepository } from './tier.repository';
import { RankingRepository } from './ranking.repository';
dotenv.config();

const TOKEN = process.env.GITHUB_ACCESS_TOKEN;

@Injectable()
export class RankService {
  constructor(
    private rankerProfileRepository: RankerProfileRepository,
    private rankingRepository: RankingRepository,
    private tierRepository: TierRepository,
  ) {}

  async getRankerDetail(userName: string) {
    // DB내 검색된 유저 있는지 확인
    const check = await this.rankerProfileRepository.checkRanker(userName);

    // DB내 userName이 존재할 경우, Early Return
    if (check) {
      const rankerDetail = await this.rankerProfileRepository.getRankerProfile(
        userName,
      );
      const maxValues = await this.rankingRepository.getMaxValues();
      const avgValues = await this.rankingRepository.getAvgValues();
      return { rankerDetail, maxValues, avgValues };
    }

    //userName DB에 없을 경우 등록 시작

    //ranker_profile 등록
    const { data } = await axios.get(
      `https://api.github.com/users/${userName}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      },
    );

    await this.rankerProfileRepository.createRankerProfile(data);

    //유저의 팔로워 및 팔로잉 수
    const followingCount = data.following;
    const followersCount = data.followers;

    //유저가 누른 스타 수
    const stars = await axios.get(
      `https://api.github.com/users/${userName}/starred?per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      },
    );
    const starringCount = stars.data.length;

    //유저의 총 이슈(PR 제외), 유저의 PR수, 유저가 기여한 레포의 스타 수
    const issues = await axios.get(
      `https://api.github.com/search/issues?q=author:${userName}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      },
    );
    const pullRequest = await axios.get(
      `https://api.github.com/search/issues?q=type:pr+author:${userName}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      },
    );

    const pullRequestCount = pullRequest.data.total_count;
    const issuesCount = issues.data.total_count - pullRequestCount;

    //기여한 레포의 스타 수
    let contributingRepoStarsCount = 0;
    const allPR = pullRequest.data.items;

    for (let i = 0; i < allPR.length; i++) {
      if (allPR[i].author_association === 'CONTRIBUTOR') {
        const contributingRepo = await axios.get(allPR[i].repository_url, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        });
        contributingRepoStarsCount += contributingRepo.data.stargazers_count;
      }
    }

    //유저가 작성한 리뷰 수
    const eventList = await axios.get(
      `https://api.github.com/users/${userName}/events?per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      },
    );
    const reviews = eventList.data.filter(
      (event) => event.type === 'PullRequestReviewEvent',
    );

    const reviewCount = reviews.length;

    //스폰서 수
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

    //유저의 커밋 수
    const commits = await axios.get(
      `https://api.github.com/search/commits?q=author:${userName}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      },
    );
    const commitsCount = commits.data.total_count;

    //주 프로그래밍 언어 구하기, 포크 한 수, 개인 레포 수, 포크 된 유저의 레포 수, 와쳐 수, 내가 받은 스타 수
    const scoreBasis = await axios.get(
      `https://api.github.com/users/${userName}/repos?per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      },
    );

    const programmingLang = new Object();
    let forkingCount = 0;
    let personalRepoCount = 0;
    let forkedCount = 0;
    let watchersCount = 0;
    let myStarsCount = 0;

    for (const el of scoreBasis.data) {
      const repoName = el.name;

      if (el.fork) {
        forkingCount++;
      } else {
        personalRepoCount++;

        const reposLang = await axios.get(
          `https://api.github.com/repos/${userName}/${repoName}/languages`,
          {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          },
        );
        const languages = reposLang.data;
        for (const lang in languages) {
          if (programmingLang.hasOwnProperty(lang)) {
            programmingLang[lang] += languages[lang];
          } else {
            programmingLang[lang] = languages[lang];
          }
        }
      }
      myStarsCount += el.stargazers_count;
      forkedCount += el.forks;
      watchersCount += el.watchers_count;
    }

    const maxBit = Math.max(...Object.values(programmingLang));
    const mainLanguage = Object.keys(programmingLang).find(
      (key) => programmingLang[key] === maxBit,
    );

    //점수 및 티어 계산
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
      (sponsorsCount * 5 + myStarsCount * 4 + contributingRepoStarsCount * 3) *
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

    //등록 후 반환
    const rankerDetail = await this.rankerProfileRepository.getRankerProfile(
      userName,
    );
    const maxValues = await this.rankingRepository.getMaxValues();
    const avgValues = await this.rankingRepository.getAvgValues();
    return { rankerDetail, maxValues, avgValues };
  }

  async getTop5() {
    return await this.rankerProfileRepository.getTop5();
  }

  async getTop100(langFilter) {
    const top100Lang = await this.rankingRepository.getTop100Languages();

    let lang = '';
    if (langFilter === 'All') {
      lang = `IS NOT NULL`;
    } else if (typeof langFilter === 'string') {
      lang = `= '${langFilter}'`;
    } else {
      lang = `IS NOT NULL`;
    }

    const top100 = await this.rankerProfileRepository.getTop100(lang);

    const mainLanguages = new Set();

    top100Lang.forEach((el) => mainLanguages.add(el.main_language));

    const langCategory = Array.from(mainLanguages);

    return { langCategory, top100 };
  }

  async findRanker(userName) {
    return await this.rankerProfileRepository.findRanker(userName);
  }
}

// scoreBasis.data.forEach(async (el) => {
//   try {
//     if (el.fork) {
//       forkingCount++;
//     } else {
//       personalRepoCount++;
//       const repoName = el.name;
//       const reposLang = await axios.get(
//         `https://api.github.com/repos/${userName}/${repoName}/languages`,
//         {
//           headers: {
//             Authorization: `Bearer ${TOKEN}`,
//           },
//         },
//       );
//       const languages = reposLang.data;
//       for (const lang in languages) {
//         if (programmingLang.hasOwnProperty(lang)) {
//           programmingLang[lang] += languages[lang];
//         } else {
//           programmingLang[lang] = languages[lang];
//         }
//       }
//     }
//     forkedCount += el.forks;
//     watchersCount += el.watchers_count;
//   } catch (error) {
//     console.log(error);
//   }
// });
