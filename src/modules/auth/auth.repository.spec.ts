import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { AuthRepository } from '../../user/database/auth.repository';
import { Career } from './database/career.orm-entity';
import { Field } from './database/field.orm-entity';

describe('AuthRepository', () => {
  let authRepository: AuthRepository;
  let careerRepository: Repository<Career>;
  let fieldRepository: Repository<Field>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthRepository,
        {
          provide: getRepositoryToken(Career),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Field),
          useClass: Repository,
        },
      ],
    }).compile();

    authRepository = moduleRef.get<AuthRepository>(AuthRepository);
    careerRepository = moduleRef.get<Repository<Career>>(
      getRepositoryToken(Career),
    );
    fieldRepository = moduleRef.get<Repository<Field>>(
      getRepositoryToken(Field),
    );
  });

  describe('getAuthCategory()', () => {
    it('SUCCESS : should return an object { fields : Field[], careers : Career[] }', async () => {
      const expectedFields = [];
      const expectedCareers = [];

      jest.spyOn(fieldRepository, 'find').mockResolvedValue(expectedFields);
      jest.spyOn(careerRepository, 'find').mockResolvedValue(expectedCareers);

      const result = await authRepository.getAuthCategory();

      expect(fieldRepository.find).toHaveBeenCalled();
      expect(careerRepository.find).toHaveBeenCalled();

      expect(result).toEqual({
        field: expectedFields,
        career: expectedCareers,
      });
    });
  });
});
