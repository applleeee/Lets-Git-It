import { Test } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { RankController } from './rank.controller';
import { RankService } from './rank.service';

const moduleMocker = new ModuleMocker(global);

describe('RankController', () => {
  let rankController: RankController;
  let rankService: RankService;

  const testRankerDetail1 = {
    rankerId: 1,
    rankerName: 'Oh',
    profileImage: '',
    blog: '',
    email: '',
    company: '',
    region: '',
    mainLang: '',
    curiosityScore: '',
    passionScore: '',
    fameScore: '',
    abilityScore: '',
    totalScore: '',
    issueNumber: 1,
    forkingNumber: 1,
    starringNumber: 1,
    followingNumber: 1,
    commitNumber: 1,
    prNumber: 1,
    reviewNumber: 1,
    personalRepoNumber: 1,
    followerNumber: 1,
    forkedNumber: 1,
    watchedNumber: 1,
    sponsorNumber: 1,
    contributingRepoStarNumber: 1,
    myStarNumber: 1,
    tier: '',
    tierImage: '',
  };
  const testRankerDetail2 = {
    rankerId: 1,
    rankerName: 'Kim',
    profileImage: '',
    blog: '',
    email: '',
    company: '',
    region: '',
    mainLang: '',
    curiosityScore: '',
    passionScore: '',
    fameScore: '',
    abilityScore: '',
    totalScore: '',
    issueNumber: 1,
    forkingNumber: 1,
    starringNumber: 1,
    followingNumber: 1,
    commitNumber: 1,
    prNumber: 1,
    reviewNumber: 1,
    personalRepoNumber: 1,
    followerNumber: 1,
    forkedNumber: 1,
    watchedNumber: 1,
    sponsorNumber: 1,
    contributingRepoStarNumber: 1,
    myStarNumber: 1,
    tier: '',
    tierImage: '',
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [RankController],
      providers: [RankService],
    })
      .useMocker((token) => {
        if (token === RankService) {
          return {
            checkRanker: jest.fn(),
            getRankerDetail: jest.fn(),
            getTop5: jest.fn(),
            getTop100: jest.fn(),
            findRanker: jest.fn(),
          };
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    rankController = moduleRef.get(RankController);
    rankService = moduleRef.get(RankService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findRanker', () => {
    it('findRanker from DB when a character is given', async () => {
      const userName = 'OH';
      const testSearchOutput = [
        {
          rankerName: userName,
          profileImage: 'http://www....',
        },
      ];
      rankService.findRanker = jest.fn().mockResolvedValue(testSearchOutput);

      const result = await rankController.findRanker(userName);

      expect(result).toEqual(testSearchOutput);
    });
  });
  describe('compareRanker', () => {
    it('compare two rankers', async () => {
      const userName = ['Oh', 'Kim'];
      const testComapreRankerOutput = {
        firstUser: {
          testRankerDetail1,
        },
        secondUser: {
          testRankerDetail2,
        },
      };
      rankService.checkRanker = jest
        .fn()
        .mockResolvedValueOnce({
          testRankerDetail1,
        })
        .mockResolvedValueOnce({
          testRankerDetail2,
        });
      const result = await rankController.compareRanker(userName);

      expect(result).toEqual(testComapreRankerOutput);
    });
  });
  describe('getRankerDetail', () => {
    it('get a ranking detail of github user', async () => {
      const userName = 'Oh';
      const testRankerDetail = {
        testRankerDetail1,
      };

      rankService.checkRanker = jest.fn().mockResolvedValueOnce({
        testRankerDetail1,
      });
      const result = await rankController.getRankerDetail(userName);

      expect(result).toEqual(testRankerDetail);
    });
  });

  describe('getTop5', () => {
    it('get Top 5 Rankers', async () => {
      const testTop5 = [
        {
          rankerName: 'oh',
          profileImage: 'https://wwww....',
          totalScore: '1234',
        },
      ];

      rankService.getTop5 = jest.fn().mockResolvedValueOnce(testTop5);
      const result = await rankController.getTop5();

      expect(result).toEqual(testTop5);
    });
  });

  describe('getTop100', () => {
    it('get Top 100 Rankers', async () => {
      const langFilter = '';
      const testTop100 = [
        {
          rankerName: 'serranoarevalo',
          mainLang: 'C',
          followerNumber: 3834,
          myStarNumber: 380,
          commitNumber: 12991,
          totalScore: '191302.0000',
          tier: 'gold',
          tierImage: null,
        },
        {
          rankerName: 'Hesh0629',
          mainLang: 'Jupyter Notebook',
          followerNumber: 15,
          myStarNumber: 2,
          commitNumber: 971,
          totalScore: '1020.0000',
          tier: 'silver',
          tierImage: null,
        },
        {
          rankerName: 'dahyen0o',
          mainLang: 'Python',
          followerNumber: 12,
          myStarNumber: 3,
          commitNumber: 351,
          totalScore: '473.0000',
          tier: 'silver',
          tierImage: null,
        },
      ];
      const testTop100Lang = [
        { main_language: 'Jupyter Notebook' },
        { main_language: 'C' },
        { main_language: 'Python' },
      ];

      rankService.getTop100 = jest.fn().mockResolvedValueOnce({
        top100: testTop100,
        langCategory: testTop100Lang,
      });
      const result = await rankController.getTop100(langFilter);

      expect(result).toEqual({
        langCategory: testTop100Lang,
        top100: testTop100,
      });
    });
  });
  describe('updateRankerProfile', () => {
    it('Update Ranking Information of User', async () => {
      const userName = 'Oh';
      const expectedURL = { URL: `/userDetail/${userName}` };

      rankService.getRankerDetail = jest.fn().mockResolvedValue(undefined);
      const result = await rankController.updateRankerProfile(userName);

      expect(result).toEqual(expectedURL);
    });
  });
});
