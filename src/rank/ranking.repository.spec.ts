import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ranking } from 'src/entities/Ranking';
import { Repository } from 'typeorm';
import { LangOutput, TotalScoresOutput } from './dto/ranking.dto';
import { RankingRepository } from './ranking.repository';

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
    where: jest.fn().mockReturnThis(),
    execute: jest.fn().mockReturnThis(),
  }),
  exist: jest.fn().mockReturnThis(),
});

const ranking = {
  mainLanguage: 'TypeScript',
  curiosityScore: 90,
  passionScore: 85,
  fameScore: 70,
  abilityScore: 80,
  totalScore: 325,
  curiosityRaiseIssueNumber: 10,
  curiosityForkRepositoryNumber: 20,
  curiosityGiveStarRepositoryNumber: 30,
  curiosityFollowingNumber: 40,
  passionCommitNumber: 50,
  passionPrNumber: 60,
  passionReviewNumber: 70,
  passionCreateRepositoryNumber: 80,
  fameFollowerNumber: 90,
  fameRepositoryForkedNumber: 100,
  fameRepositoryWatchedNumber: 110,
  abilitySponseredNumber: 120,
  abilityPublicRepositoryStarNumber: 130,
  abilityContributeRepositoryStarNumber: 140,
  rankerProfileId: 1,
  tierId: 2,
};

describe('RankingRepository', () => {
  let rankingRepository: RankingRepository;
  let rankingRepo: Repository<Ranking>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RankingRepository,
        {
          provide: getRepositoryToken(Ranking),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    rankingRepository = moduleRef.get<RankingRepository>(RankingRepository);
    rankingRepo = moduleRef.get<Repository<Ranking>>(
      getRepositoryToken(Ranking),
    );
  });

  describe('getAllScores Function', () => {
    it('Successfully Return All Scores', async () => {
      const expectedAllScoresOutput = [new TotalScoresOutput()];
      jest
        .spyOn(rankingRepo.createQueryBuilder(), 'getRawMany')
        .mockResolvedValue(expectedAllScoresOutput);
      const result = await rankingRepository.getAllScores();

      expect(result).toEqual(expectedAllScoresOutput);
    });
  });

  describe('registerRanking Function', () => {
    it('Successfully Register Ranking', async () => {
      jest
        .spyOn(rankingRepo.createQueryBuilder(), 'execute')
        .mockResolvedValue(undefined);

      await rankingRepository.registerRanking(
        ranking.mainLanguage,
        ranking.curiosityScore,
        ranking.passionScore,
        ranking.fameScore,
        ranking.abilityScore,
        ranking.totalScore,
        ranking.curiosityRaiseIssueNumber,
        ranking.curiosityForkRepositoryNumber,
        ranking.curiosityGiveStarRepositoryNumber,
        ranking.curiosityFollowingNumber,
        ranking.passionCommitNumber,
        ranking.passionPrNumber,
        ranking.passionReviewNumber,
        ranking.passionCreateRepositoryNumber,
        ranking.fameFollowerNumber,
        ranking.fameRepositoryForkedNumber,
        ranking.fameRepositoryWatchedNumber,
        ranking.abilitySponseredNumber,
        ranking.abilityPublicRepositoryStarNumber,
        ranking.abilityContributeRepositoryStarNumber,
        ranking.rankerProfileId,
        ranking.tierId,
      );
    });
  });

  describe('getTop100Languages Function', () => {
    it('Successfully Get Top 100 Languages', async () => {
      const expectedTop100Languages = [new LangOutput()];
      jest
        .spyOn(rankingRepo.createQueryBuilder(), 'getRawMany')
        .mockResolvedValue(expectedTop100Languages);

      const result = await rankingRepository.getTop100Languages();

      expect(result).toEqual(expectedTop100Languages);
    });
  });

  describe('checkRanking Function', () => {
    it('Returns True if a ranking Exists', async () => {
      jest.spyOn(rankingRepo, 'exist').mockResolvedValue(true);

      const result = await rankingRepository.checkRanking(1);
      expect(result).toEqual(true);
      expect(rankingRepo.exist).toHaveBeenCalledWith({
        where: { rankerProfileId: 1 },
      });
    });

    it("Returns False if a ranking Doesn't Exists", async () => {
      jest.spyOn(rankingRepo, 'exist').mockResolvedValue(false);

      const result = await rankingRepository.checkRanking(1);
      expect(result).toEqual(false);
      expect(rankingRepo.exist).toHaveBeenCalledWith({
        where: { rankerProfileId: 1 },
      });
    });
  });

  describe('updateRanking Function', () => {
    it('Successfully Update a Ranking', async () => {
      jest.spyOn(rankingRepo, 'createQueryBuilder').mockReturnValue({
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn(),
      } as any);

      await rankingRepository.updateRanking(
        ranking.mainLanguage,
        ranking.curiosityScore,
        ranking.passionScore,
        ranking.fameScore,
        ranking.abilityScore,
        ranking.totalScore,
        ranking.curiosityRaiseIssueNumber,
        ranking.curiosityForkRepositoryNumber,
        ranking.curiosityGiveStarRepositoryNumber,
        ranking.curiosityFollowingNumber,
        ranking.passionCommitNumber,
        ranking.passionPrNumber,
        ranking.passionReviewNumber,
        ranking.passionCreateRepositoryNumber,
        ranking.fameFollowerNumber,
        ranking.fameRepositoryForkedNumber,
        ranking.fameRepositoryWatchedNumber,
        ranking.abilitySponseredNumber,
        ranking.abilityPublicRepositoryStarNumber,
        ranking.abilityContributeRepositoryStarNumber,
        ranking.rankerProfileId,
        ranking.tierId,
      );

      expect(
        rankingRepo.createQueryBuilder().update().set,
      ).toHaveBeenCalledWith({
        mainLanguage: ranking.mainLanguage,
        curiosityScore: ranking.curiosityScore,
        passionScore: ranking.passionScore,
        fameScore: ranking.fameScore,
        abilityScore: ranking.abilityScore,
        totalScore: ranking.totalScore,
        curiosityRaiseIssueNumber: ranking.curiosityRaiseIssueNumber,
        curiosityForkRepositoryNumber: ranking.curiosityForkRepositoryNumber,
        curiosityGiveStarRepositoryNumber:
          ranking.curiosityGiveStarRepositoryNumber,
        curiosityFollowingNumber: ranking.curiosityFollowingNumber,
        passionCommitNumber: ranking.passionCommitNumber,
        passionPrNumber: ranking.passionPrNumber,
        passionReviewNumber: ranking.passionReviewNumber,
        passionCreateRepositoryNumber: ranking.passionCreateRepositoryNumber,
        fameFollowerNumber: ranking.fameFollowerNumber,
        fameRepositoryForkedNumber: ranking.fameRepositoryForkedNumber,
        fameRepositoryWatchedNumber: ranking.fameRepositoryWatchedNumber,
        abilitySponseredNumber: ranking.abilitySponseredNumber,
        abilityPublicRepositoryStarNumber:
          ranking.abilityPublicRepositoryStarNumber,
        abilityContributeRepositoryStarNumber:
          ranking.abilityContributeRepositoryStarNumber,
        tierId: ranking.tierId,
      });
      expect(
        rankingRepo.createQueryBuilder().update().where,
      ).toHaveBeenCalledWith('ranker_profile_id=:rankerId', {
        rankerId: 1,
      });
    });
  });
});
