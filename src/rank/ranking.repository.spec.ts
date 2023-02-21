import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ranking } from 'src/entities/Ranking';
import { Repository } from 'typeorm';
import { TotalScoresOutput } from './dto/ranking.dto';
import { RankingRepository } from './ranking.repository';

const mockRepository = () => ({
  createQueryBuilder: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(),
    getRawMany: jest.fn().mockReturnThis(),
  }),
});

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

    it('DATABASE SERVER CONNECTION ERROR', async () => {
      const error = new Error('Database server connection error');
      jest
        .spyOn(rankingRepo.createQueryBuilder(), 'getRawMany')
        .mockRejectedValue(error);

      await expect(rankingRepository.getAllScores()).rejects.toThrowError(
        'DATABASE SERVER CONNECTION ERROR',
      );
      await expect(rankingRepository.getAllScores()).rejects.toThrowError();
    });
  });
  it.todo('registerRanking');
  it.todo('getMaxValues');
  it.todo('getAvgValues');
  it.todo('getTop100Languages');
  it.todo('checkRanking');
  it.todo('updateRanking');
});
