import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RankerProfile } from 'src/entities/RankerProfile';
import { Repository } from 'typeorm';
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
    where: jest.fn().mockReturnThis(),
    execute: jest.fn().mockReturnThis(),
  }),
  exist: jest.fn().mockReturnThis(),
});

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
  it.todo('checkRanker');
  it.todo('getUserNameByUserId');
  it.todo('getRankerId');
  it.todo('createRankerProfile');
  it.todo('getRankerProfile');
  it.todo('getTop5');
  it.todo('getTop100');
  it.todo('findRanker');
  it.todo('getMyPage');
  it.todo('updaterankerProfile');
  it.todo('getLatestRankerData');
  it.todo('getUserTier');
});
