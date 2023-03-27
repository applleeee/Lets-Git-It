import { Test, TestingModule } from '@nestjs/testing';
import { RankService } from './rank.service';
import { RankerProfileRepository } from './rankerProfile.repository';
import { RankingRepository } from './ranking.repository';
import { TierRepository } from './tier.repository';

describe('RankService', () => {
  let service: RankService;
  let rankerProfileRepository: RankerProfileRepository;
  let rankingRepository: RankingRepository;

  const testRankerDetail = {
    rankerId: 1,
    rankerName: 'TopBackDev',
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
    tierId: 1,
    tier: '',
    tierImage: '',
    userRank: '1',
  };

  const rankerPosition = {
    rankerPosCuriosityScore: 20,
    rankerPosPassionScore: 13,
    rankerPosFameScore: 11,
    rankerPosAbilityScore: 0,
    rankerPosTotalScore: 8,
    rankerPosIssueNumber: 50,
    rankerPosForkingNumber: 23,
    rankerPosStarringNumber: 10,
    rankerPosFollowingNumber: 13,
    rankerPosCommitNumber: 12,
    rankerPosReviewNumber: 0,
    rankerPosPersonalRepoNumber: 33,
    rankerPosFollowerNumber: 12,
    rankerPosForkedNumber: 0,
    rankerPosWatchedNumber: 1,
    rankerPosSponsorNumber: NaN,
    rankerPosContributingRepoStarNumber: 0,
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        RankService,
        {
          provide: RankerProfileRepository,
          useValue: {
            checkRanker: jest.fn(),
            getRankerProfile: jest.fn(),
            getTop5: jest.fn(),
            getTop100: jest.fn(),
            findRanker: jest.fn(),
          },
        },
        {
          provide: RankingRepository,
          useValue: {
            getMaxValues: jest.fn(),
            getAvgValues: jest.fn(),
            getTop100Languages: jest.fn(),
          },
        },
        {
          provide: TierRepository,
          useValue: {
            getTierData: jest.fn(),
          },
        },
      ],
    }).compile();
    service = moduleRef.get<RankService>(RankService);
    rankerProfileRepository = moduleRef.get(RankerProfileRepository);
    rankingRepository = moduleRef.get(RankingRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('CheckRanker', () => {
    it('Ranker Exists', async () => {
      const userName = 'TopBackDev';

      jest
        .spyOn(rankerProfileRepository, 'checkRanker')
        .mockResolvedValue(true);
      jest
        .spyOn(rankerProfileRepository, 'getRankerProfile')
        .mockResolvedValue(testRankerDetail);

      const result = await service.checkRanker(userName);

      expect(result).toEqual({
        rankerDetail: testRankerDetail,
      });
    });

    it('Ranker Not Found, Continue to Next Fn', async () => {
      const userName = 'TopBackDev';
      jest
        .spyOn(rankerProfileRepository, 'checkRanker')
        .mockResolvedValue(false);

      jest.spyOn(service, 'getRankerDetail').mockResolvedValue({
        rankerDetail: testRankerDetail,
        rankerPosition,
      });

      const rankerInfo = await service.checkRanker(userName);

      expect(rankerInfo).toEqual({
        rankerDetail: testRankerDetail,
        rankerPosition,
      });
    });
  });

  describe('Get Top5', () => {
    it('Get Top 5', async () => {
      const testTop5 = [
        {
          rankerName: 'oh',
          profileImage: 'https://wwww....',
          totalScore: '1234',
        },
      ];
      jest
        .spyOn(rankerProfileRepository, 'getTop5')
        .mockResolvedValue(testTop5);

      const top5 = await service.getTop5();

      expect(top5).toEqual(testTop5);
    });
  });

  describe('Get Top 100', () => {
    it('Get Top 100 for ALL Languages', async () => {
      const langFilter = 'All';
      const testTop100 = [
        {
          rankerProfileId: 1,
          rankerName: 'serranoarevalo',
          mainLang: 'C',
          followerNumber: 3834,
          myStarNumber: 380,
          commitNumber: 12991,
          totalScore: '191302',
          tier: 'gold',
          tierImage: null,
        },
        {
          rankerProfileId: 2,
          rankerName: 'Hesh0629',
          mainLang: 'Jupyter Notebook',
          followerNumber: 15,
          myStarNumber: 2,
          commitNumber: 971,
          totalScore: '1020',
          tier: 'silver',
          tierImage: null,
        },
        {
          rankerProfileId: 3,
          rankerName: 'dahyen0o',
          mainLang: 'Python',
          followerNumber: 12,
          myStarNumber: 3,
          commitNumber: 351,
          totalScore: '473',
          tier: 'silver',
          tierImage: null,
        },
      ];
      const testTop100Lang = [
        { main_language: 'Jupyter Notebook' },
        { main_language: 'C' },
        { main_language: 'Python' },
      ];
      const expectedLangCategory = ['Jupyter Notebook', 'C', 'Python'];

      jest
        .spyOn(rankerProfileRepository, 'getTop100')
        .mockResolvedValue(testTop100);
      jest
        .spyOn(rankingRepository, 'getTop100Languages')
        .mockResolvedValue(testTop100Lang);

      const result = await service.getTop100(langFilter);

      expect(rankerProfileRepository.getTop100).toHaveBeenCalledWith(
        expect.any(String),
      );
      expect(rankingRepository.getTop100Languages).toHaveBeenCalled();
      expect(result.top100).toEqual(testTop100);
      expect(result.langCategory).toEqual(expectedLangCategory);
    });

    it('should filter the top 100 rankers by language', async () => {
      const langFilter = 'C';
      const testTop100 = [
        {
          rankerProfileId: 1,
          rankerName: 'serranoarevalo',
          mainLang: 'C',
          followerNumber: 3834,
          myStarNumber: 380,
          commitNumber: 12991,
          totalScore: '191302',
          tier: 'gold',
          tierImage: null,
        },
        {
          rankerProfileId: 4,
          rankerName: 'sieuneee',
          mainLang: 'C',
          followerNumber: 10,
          myStarNumber: 2,
          commitNumber: 189,
          totalScore: '277',
          tier: 'bronze',
          tierImage: null,
        },
      ];
      const testTop100Lang = [
        { main_language: 'Jupyter Notebook' },
        { main_language: 'C' },
        { main_language: 'Python' },
      ];
      const expectedLangCategory = ['Jupyter Notebook', 'C', 'Python'];

      jest
        .spyOn(rankerProfileRepository, 'getTop100')
        .mockResolvedValue(testTop100);
      jest
        .spyOn(rankingRepository, 'getTop100Languages')
        .mockResolvedValue(testTop100Lang);

      const result = await service.getTop100(langFilter);

      expect(rankerProfileRepository.getTop100).toHaveBeenCalledWith(
        expect.any(String),
      );
      expect(rankingRepository.getTop100Languages).toHaveBeenCalled();
      expect(result.top100).toEqual(testTop100);
      expect(result.langCategory).toEqual(expectedLangCategory);
    });

    it('should default to all languages if language filter is invalid', async () => {
      const langFilter = 123;
      const testTop100 = [
        {
          rankerProfileId: 1,
          rankerName: 'serranoarevalo',
          mainLang: 'C',
          followerNumber: 3834,
          myStarNumber: 380,
          commitNumber: 12991,
          totalScore: '191302',
          tier: 'gold',
          tierImage: null,
        },
        {
          rankerProfileId: 2,
          rankerName: 'Hesh0629',
          mainLang: 'Jupyter Notebook',
          followerNumber: 15,
          myStarNumber: 2,
          commitNumber: 971,
          totalScore: '1020',
          tier: 'silver',
          tierImage: null,
        },
        {
          rankerProfileId: 3,
          rankerName: 'dahyen0o',
          mainLang: 'Python',
          followerNumber: 12,
          myStarNumber: 3,
          commitNumber: 351,
          totalScore: '473',
          tier: 'silver',
          tierImage: null,
        },
      ];
      const testTop100Lang = [
        { main_language: 'Jupyter Notebook' },
        { main_language: 'C' },
        { main_language: 'Python' },
      ];
      const expectedLangCategory = ['Jupyter Notebook', 'C', 'Python'];

      jest
        .spyOn(rankerProfileRepository, 'getTop100')
        .mockResolvedValue(testTop100);
      jest
        .spyOn(rankingRepository, 'getTop100Languages')
        .mockResolvedValue(testTop100Lang);

      const result = await service.getTop100(langFilter);

      expect(rankerProfileRepository.getTop100).toHaveBeenCalledWith(
        expect.any(String),
      );
      expect(rankingRepository.getTop100Languages).toHaveBeenCalled();
      expect(result.top100).toEqual(testTop100);
      expect(result.langCategory).toEqual(expectedLangCategory);
    });
  });

  describe('findRanker', () => {
    it('Finding a User', async () => {
      const userName = 'MatheGoD';
      const testSearchOutput = [
        {
          rankerName: userName,
          profileImage: 'http://www....',
        },
      ];
      jest
        .spyOn(rankerProfileRepository, 'findRanker')
        .mockResolvedValue(testSearchOutput);

      const rankers = await service.findRanker(userName);

      expect(rankers).toEqual(testSearchOutput);
    });
  });
  it.todo('getRankderDetail');
});
