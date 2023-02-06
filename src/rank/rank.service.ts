import { Injectable } from '@nestjs/common';
import { RankerProfile } from '../entities/RankerProfile';
import axios from 'axios';
import { RankerProfileRepository } from './rank_profile.repository';
import * as dotenv from 'dotenv';
dotenv.config();

const TOKEN = process.env.GITHUB_ACCESS_TOKEN;

@Injectable()
export class RankService {
  constructor(private rankRepository: RankerProfileRepository) {}

  async getRankerDetail(userName: string): Promise<RankerProfile> {
    const check = await this.rankRepository.checkRanker(userName);

    //데이터베이스 내 userName이 존재할 경우, Early Return
    if (check) {
      return await this.rankRepository.getRankerProfile(userName);
    }

    //userName이 없을 경우 등록 시작
    const { data } = await axios.get(
      `https://api.github.com/users/${userName}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      },
    );

    await this.rankRepository.createRankerProfile(data);

    const stars = await axios.get(
      `https://api.github.com/users/${userName}/starred`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      },
    );

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

    const followingCount = data.following;
    const followersCount = data.followers;
    const starringCount = stars.data.length;
    const totalPR = pullRequest.data.total_count;
    const totalIssues = issues.data.total_count - totalPR;

    const scoreBasis = await axios.get(
      `https://api.github.com/users/${userName}/repos`,
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
    let commitsCount = 0;
    let myStarsCount = 0;

    for (const el of scoreBasis.data) {
      const repoName = el.name;

      const commitData = await axios.get(
        `https://api.github.com/repos/${userName}/${repoName}/commits`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        },
      );

      const commits = commitData.data;

      for (const el of commits) {
        if (el.commit.author.name === userName) {
          commitsCount++;
        }
      }

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
    const mainLang = Object.keys(programmingLang).find(
      (key) => programmingLang[key] === maxBit,
    );
    console.log({
      mainLang,
      forkingCount,
      starringCount,
      followingCount,
      commitsCount,
      personalRepoCount,
      followersCount,
      forkedCount,
      watchersCount,
      totalIssues,
      totalPR,
      sponsorsCount,
      myStarsCount,
    });
    await this.rankRepository.resetAllUsers();
    return;
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
