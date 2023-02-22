import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RankerProfile } from 'src/entities/RankerProfile';
import { Ranking } from 'src/entities/Ranking';
import { User } from 'src/entities/User';
import { Repository } from 'typeorm';
import { Top5 } from './dto/rankerProfile.dto';
import { RankerProfileRepository } from './rankerProfile.repository';

const mockRepository = () => ({
  createQueryBuilder: jest.fn().mockReturnValue({
    insert: jest.fn().mockReturnThis(),
    into: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getRawMany: jest.fn().mockReturnThis(),
    getRawOne: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    execute: jest.fn().mockReturnThis(),
  }),
  exist: jest.fn().mockReturnThis(),
  findOne: jest.fn().mockReturnThis(),
  findBy: jest.fn().mockReturnThis(),
});

const rankerDetail = {
  id: 1,
  name: 'MatheGoD',
  profileImageUrl: undefined,
  profileText: undefined,
  homepageUrl: undefined,
  email: null,
  company: null,
  region: undefined,
  userId: 1,
  createdAt: new Date(),
  updatedAt: null,
  user: new User(),
  rankings: [new Ranking()],
};

const aRankerDetail = {
  rankerId: 31,
  rankerName: 'ohohooh',
  profileImage: 'https://avatars.githubusercontent.com/u/28905794?v=4',
  blog: '',
  email: null,
  company: null,
  region: null,
  mainLang: 'none',
  curiosityScore: '0.4000',
  passionScore: '0.0000',
  fameScore: '0.0000',
  abilityScore: '0.0000',
  totalScore: '0.0000',
  issueNumber: 0,
  forkingNumber: 1,
  starringNumber: 0,
  followingNumber: 0,
  commitNumber: 0,
  prNumber: 0,
  reviewNumber: 0,
  personalRepoNumber: 0,
  followerNumber: 0,
  forkedNumber: 0,
  watchedNumber: 0,
  sponsorNumber: 0,
  contributingRepoStarNumber: 0,
  myStarNumber: 0,
  tier: 'bronze',
  tierImage: null,
};

describe('RankerProfileRepository', () => {
  let rankerProfileRepository: RankerProfileRepository;
  let rankerProfileRepo: Repository<RankerProfile>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RankerProfileRepository,
        {
          provide: getRepositoryToken(RankerProfile),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    rankerProfileRepository = moduleRef.get<RankerProfileRepository>(
      RankerProfileRepository,
    );
    rankerProfileRepo = moduleRef.get<Repository<RankerProfile>>(
      getRepositoryToken(RankerProfile),
    );
  });

  describe('checkRanker Function', () => {
    it('Returns True if a ranker Exists', async () => {
      const name = 'OH';
      jest.spyOn(rankerProfileRepo, 'exist').mockResolvedValue(true);

      const result = await rankerProfileRepository.checkRanker(name);
      expect(result).toEqual(true);
      expect(rankerProfileRepo.exist).toHaveBeenCalledWith({
        where: { name },
      });
    });

    it("Returns False if a ranker Doesn't Exists", async () => {
      const name = 'OH';
      jest.spyOn(rankerProfileRepo, 'exist').mockResolvedValue(false);

      const result = await rankerProfileRepository.checkRanker(name);
      expect(result).toEqual(false);
      expect(rankerProfileRepo.exist).toHaveBeenCalledWith({
        where: { name },
      });
    });
  });

  describe('getUserNameByUserId Function', () => {
    it('Successfully Return User Name', async () => {
      const testUserId = 1;
      const testUserName = 'MatheGoD';

      jest.spyOn(rankerProfileRepo, 'findOne').mockResolvedValue(rankerDetail);

      const result = await rankerProfileRepository.getUserNameByUserId(
        testUserId,
      );

      expect(result).toEqual(testUserName);
      expect(rankerProfileRepo.findOne).toHaveBeenCalledWith({
        where: { userId: testUserId },
      });
    });
    it.todo('Return an Error');
  });

  describe('getRankerId Function', () => {
    it('Successfully Return Ranker Id', async () => {
      const name = 'MatheGoD';
      const testRankerId = 1;

      jest.spyOn(rankerProfileRepo, 'findOne').mockResolvedValue(rankerDetail);

      const result = await rankerProfileRepository.getRankerId(name);

      expect(result).toEqual(testRankerId);
      expect(rankerProfileRepo.findOne).toHaveBeenCalledWith({
        where: { name },
      });
    });
  });

  describe('createRankerProfile Function', () => {
    it('Successfuly Create Ranker Profile', async () => {
      jest
        .spyOn(rankerProfileRepo.createQueryBuilder(), 'execute')
        .mockResolvedValue(undefined);

      await rankerProfileRepository.createRankerProfile(rankerDetail);
    });
  });

  describe('getRankerProfile Function', () => {
    it('Successfully Return A Ranker Profile', async () => {
      const name = 'ohohooh';
      jest
        .spyOn(rankerProfileRepo.createQueryBuilder(), 'getRawOne')
        .mockResolvedValue(aRankerDetail);

      const result = await rankerProfileRepository.getRankerProfile(name);

      expect(result).toEqual(aRankerDetail);
      expect(
        rankerProfileRepo.createQueryBuilder().select().where,
      ).toHaveBeenCalledTimes(1);
      expect(
        rankerProfileRepo.createQueryBuilder().select().where,
      ).toHaveBeenCalledWith(`RankerProfile.name='${name}'`);
    });
  });

  describe('getTop5 Function', () => {
    it('Successfully Return Top 5 Rankers', async () => {
      const expectedTop5 = [new Top5()];
      jest
        .spyOn(rankerProfileRepo.createQueryBuilder(), 'getRawMany')
        .mockResolvedValue(expectedTop5);

      const result = await rankerProfileRepository.getTop5();

      expect(result).toEqual(expectedTop5);
    });
  });

  describe('getTop100 Function', () => {
    it('Successfully Return Top 100 Rankers using All Programming Languages', async () => {
      const lang = 'IS NOT NULL';
      const expectedTop100 = [
        {
          rankerName: 'serranoarevalo',
          mainLang: 'C#',
          followerNumber: 3834,
          myStarNumber: 380,
          commitNumber: 12991,
          totalScore: '191361.0000',
          tier: 'gold',
          tierImage: null,
        },
        {
          rankerName: 'Mollayo',
          mainLang: 'C++',
          followerNumber: 4,
          myStarNumber: 50,
          commitNumber: 302,
          totalScore: '12368.0000',
          tier: 'gold',
          tierImage: null,
        },
        {
          rankerName: 'RangHo',
          mainLang: 'C++',
          followerNumber: 87,
          myStarNumber: 52,
          commitNumber: 400,
          totalScore: '11806.0000',
          tier: 'gold',
          tierImage: null,
        },
        {
          rankerName: 'versus',
          mainLang: 'Go',
          followerNumber: 16,
          myStarNumber: 5,
          commitNumber: 316,
          totalScore: '9075.0000',
          tier: 'gold',
          tierImage: null,
        },
      ];
      jest
        .spyOn(rankerProfileRepo.createQueryBuilder(), 'getRawMany')
        .mockResolvedValue(expectedTop100);

      const result = await rankerProfileRepository.getTop100(lang);

      expect(result).toEqual(expectedTop100);
      expect(
        rankerProfileRepo.createQueryBuilder().select().where,
      ).toHaveBeenCalledWith(`r.main_language ${lang}`);
    });

    it('Successfully Return Top 100 Rankers using Only JavaScript', async () => {
      const lang = 'JavaScript';
      const expectedTop100 = [
        {
          rankerName: 'bigfanoftim',
          mainLang: 'JavaScript',
          followerNumber: 44,
          myStarNumber: 0,
          commitNumber: 994,
          totalScore: '1158.0000',
          tier: 'silver',
          tierImage: null,
        },
        {
          rankerName: 'hubaimaster',
          mainLang: 'JavaScript',
          followerNumber: 56,
          myStarNumber: 77,
          commitNumber: 752,
          totalScore: '1106.0000',
          tier: 'silver',
          tierImage: null,
        },
        {
          rankerName: 'poki1219',
          mainLang: 'JavaScript',
          followerNumber: 15,
          myStarNumber: 1,
          commitNumber: 496,
          totalScore: '537.0000',
          tier: 'silver',
          tierImage: null,
        },
      ];
      jest
        .spyOn(rankerProfileRepo.createQueryBuilder(), 'getRawMany')
        .mockResolvedValue(expectedTop100);

      const result = await rankerProfileRepository.getTop100(lang);

      expect(result).toEqual(expectedTop100);
      expect(
        rankerProfileRepo.createQueryBuilder().select().where,
      ).toHaveBeenCalledWith(`r.main_language ${lang}`);
    });
  });

  describe('findRanker Function', () => {
    it('Returns any Rankers matching with Input Values', async () => {
      const userName = 'MatheGoD';
      const expectedSearchOutput = [
        {
          rankerName: 'MatheGoD',
          profileImage: 'https://avatars.githubusercontent.com/u/110371295?v=4',
          tierImage: null,
        },
      ];
      jest
        .spyOn(rankerProfileRepo.createQueryBuilder(), 'getRawMany')
        .mockResolvedValue(expectedSearchOutput);

      const result = await rankerProfileRepository.findRanker(userName);

      expect(result).toEqual(expectedSearchOutput);
      expect(
        rankerProfileRepo.createQueryBuilder().select().where,
      ).toHaveBeenCalledWith('RankerProfile.name LIKE :rankerName', {
        rankerName: `%${userName}%`,
      });
    });
  });

  describe('getMayPage Function', () => {
    it('Return a Valid Ranker Information', async () => {
      const userId = 1;
      jest.spyOn(rankerProfileRepo, 'findBy').mockResolvedValue([rankerDetail]);

      const result = await rankerProfileRepository.getMyPage(userId);

      expect(result).toEqual([rankerDetail]);
      expect(rankerProfileRepo.findBy).toHaveBeenCalledWith({
        userId,
      });
    });

    it('Return a Defaul Message', async () => {
      const userId = 456;
      const expectedError = {
        userName: '랭킹 정보를 검색해주세요!',
        profileText: '랭킹 정보를 검색해주세요!',
        profileImageUrl: '랭킹 정보를 검색해주세요!',
        email: '랭킹 정보를 검색해주세요!',
      };

      jest.spyOn(rankerProfileRepo, 'findBy').mockResolvedValue(null);

      const result = await rankerProfileRepository.getMyPage(userId);

      expect(result).toEqual(expectedError);

      expect(rankerProfileRepo.findBy).toHaveBeenCalledWith({
        userId,
      });
    });
  });

  describe('updateRankerProfile Function', () => {
    it('Successfully Update Ranker Profile', async () => {
      const userName = '';
      const profileImageUrl = '';
      const homepageUrl = '';
      const email = '';
      const company = '';
      const region = '';
      const userId = 2;
      jest
        .spyOn(rankerProfileRepo.createQueryBuilder(), 'execute')
        .mockResolvedValue(null);

      await rankerProfileRepository.updateRankerProfile(
        userName,
        profileImageUrl,
        homepageUrl,
        email,
        company,
        region,
        userId,
      );
      expect(
        rankerProfileRepo.createQueryBuilder().update().set,
      ).toHaveBeenCalledWith({
        profileImageUrl,
        homepageUrl,
        email,
        company,
        region,
        userId,
      });
      expect(rankerProfileRepo.createQueryBuilder().where).toHaveBeenCalledWith(
        'name = :name',
        { name: userName },
      );
    });
  });
  describe('getLatestRankerData Function', () => {
    it('Successfully Update Profile Data', async () => {
      jest
        .spyOn(rankerProfileRepo.createQueryBuilder(), 'execute')
        .mockResolvedValue(null);

      await rankerProfileRepository.getLatestRankerData(rankerDetail);

      expect(
        rankerProfileRepo.createQueryBuilder().update().set,
      ).toHaveBeenCalledWith({
        profileImageUrl: rankerDetail['profileImageUrl'],
        profileText: rankerDetail['profileText'],
        homepageUrl: rankerDetail['homepageUrl'],
        email: rankerDetail['email'],
        company: rankerDetail['company'],
        region: rankerDetail['region'],
      });
      expect(rankerProfileRepo.createQueryBuilder().where).toHaveBeenCalledWith(
        'name = :name',
        { name: undefined },
      );
    });
  });

  describe('getUserTier Function', () => {
    it("Return a User's Tier Information", async () => {
      const userName = 'OH';
      const expectedOutput = {
        tierName: 'bronze',
        tierImage: null,
      };

      jest
        .spyOn(rankerProfileRepo.createQueryBuilder(), 'getRawOne')
        .mockResolvedValue(expectedOutput);

      const result = await rankerProfileRepository.getUserTier(userName);

      expect(result).toEqual(expectedOutput);
      expect(
        rankerProfileRepo.createQueryBuilder().select().where,
      ).toHaveBeenCalledWith('RankerProfile.name LIKE :rankerName', {
        rankerName: `%${userName}%`,
      });
    });
  });
});
