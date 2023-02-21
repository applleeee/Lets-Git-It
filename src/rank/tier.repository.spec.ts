import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tier } from '../entities/Tier';
import { TierRepository } from './tier.repository';

describe('TierRepository', () => {
  let tierRepository: TierRepository;
  let tierRepo: Repository<Tier>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TierRepository,
        {
          provide: getRepositoryToken(Tier),
          useClass: Repository,
        },
      ],
    }).compile();

    tierRepository = moduleRef.get<TierRepository>(TierRepository);
    tierRepo = moduleRef.get<Repository<Tier>>(getRepositoryToken(Tier));
  });

  describe('getTierData Function', () => {
    it('Successfully return Tier Data', async () => {
      const tiers = [new Tier()];
      jest.spyOn(tierRepo, 'find').mockResolvedValue(tiers);

      const result = await tierRepository.getTierData();

      expect(result).toBe(tiers);
    });

    it('DATABASE SERVER CONNECTION ERROR', async () => {
      const error = new Error('Database server connection error');
      jest.spyOn(tierRepo, 'find').mockRejectedValue(error);

      await expect(tierRepository.getTierData()).rejects.toThrow(HttpException);
      await expect(tierRepository.getTierData()).rejects.toThrowError(
        'DATABASE SERVER CONNECTION ERROR',
      );
      await expect(tierRepository.getTierData()).rejects.toThrowError();
    });
  });
});
