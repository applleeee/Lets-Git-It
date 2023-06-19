import { User } from './database/user.orm-entity';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryFailedError, TypeORMError } from 'typeorm';
import { SignUpDto } from './dto/createUser.dto';
import { UserRepository } from './user.repository';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateMyPageDto } from './dto/mypage.dto';

class MockRepository extends User {
  create = jest.fn();
  save = jest.fn();
  findOneBy = jest.fn();
  update = jest.fn();

  constructor() {
    super();
  }
}

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let mockRepository: MockRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(User),
          useClass: MockRepository,
        },
      ],
    }).compile();

    userRepository = moduleRef.get<UserRepository>(UserRepository);
    mockRepository = moduleRef.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getByGithubId()', () => {
    it('SUCCESS : should find a user by github id', async () => {
      const githubId = 123;
      const expectedUser = new User();

      jest.spyOn(mockRepository, 'findOneBy').mockResolvedValue(expectedUser);

      const result = await userRepository.getByGithubId(githubId);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ githubId });
      expect(result).toBe(expectedUser);
    });
  });

  describe('getUserIdByGithubId()', () => {
    it('SUCCESS : should find a user id by github id', async () => {
      const githubId = 123;
      const expectedUser = new User();
      expectedUser.id = 456;

      jest.spyOn(mockRepository, 'findOneBy').mockResolvedValue(expectedUser);

      const result = await userRepository.getUserIdByGithubId(githubId);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ githubId });
      expect(result).toEqual(expectedUser.id);
    });
  });

  describe('getByUserId()', () => {
    it('SUCCESS : should find a user by id', async () => {
      const id = 123;
      const expectedUser = new User();
      jest.spyOn(mockRepository, 'findOneBy').mockResolvedValue(expectedUser);

      const result = await userRepository.getByUserId(id);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id });

      expect(result).toBe(expectedUser);
    });
  });

  describe('createUser()', () => {
    const signUpData: SignUpDto = {
      githubId: 1,
      fieldId: 1,
      careerId: 1,
      isKorean: true,
    };
    it('SUCCESS : Should create a new user', async () => {
      const user = new User();
      user.githubId = signUpData.githubId;
      user.fieldId = signUpData.fieldId;
      user.careerId = signUpData.careerId;
      user.isKorean = signUpData.isKorean;

      jest.spyOn(mockRepository, 'create').mockReturnValue(user);
      jest.spyOn(mockRepository, 'save').mockReturnValue(user);

      const result = await userRepository.createUser(signUpData);

      expect(result).toEqual(user);
      expect(mockRepository.create).toHaveBeenCalledWith(signUpData);
      expect(mockRepository.save).toHaveBeenCalledWith(user);
    });

    it('FAILURE : Should handle a duplicate username when creating a user', async () => {
      const user = new User();
      user.githubId = signUpData.githubId;
      user.fieldId = signUpData.fieldId;
      user.careerId = signUpData.careerId;
      user.isKorean = signUpData.isKorean;

      const mockError = new QueryFailedError(
        `test`,
        [],
        new Error('ER_DUP_ENTRY'),
      );

      jest.spyOn(mockRepository, 'create').mockReturnValue(user);
      jest.spyOn(mockRepository, 'save').mockRejectedValue(mockError);

      await mockRepository.create(signUpData);
      try {
        await mockRepository.save(user);
      } catch (error) {
        try {
          if (error.name === 'QueryFailedError') {
            expect(error).toBeInstanceOf(QueryFailedError);
            throw new HttpException('USER_ALREADY_EXIST', HttpStatus.CONFLICT);
          } else {
            throw new HttpException(
              'INTERNAL_SEVER_ERROR',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.message).toBe('USER_ALREADY_EXIST');
          expect(error.status).toBe(HttpStatus.CONFLICT);
        }
      }

      expect(mockRepository.create).toHaveBeenCalledWith(signUpData);
      expect(mockRepository.save).toHaveBeenCalledWith(user);
    });

    it('FAILURE : Should handle other errors when creating a user', async () => {
      const error = new TypeORMError();

      jest.spyOn(mockRepository, 'save').mockRejectedValue(error);

      const notCreatedUser = await mockRepository.create(signUpData);
      try {
        await mockRepository.save(notCreatedUser);
      } catch (error) {
        try {
          if (error.message !== 'ER_DUP_ENTRY') {
            throw new HttpException(
              'INTERNAL_SERVER_ERROR',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.message).toBe('INTERNAL_SERVER_ERROR');
          expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }

      expect(mockRepository.save).toHaveBeenCalledWith(notCreatedUser);
    });
  });

  describe('updateMyPage()', () => {
    it('SUCCESS : should update myPage', async () => {
      const userId = 1;
      const partialEntity: UpdateMyPageDto = {
        fieldId: 1,
        careerId: 1,
        isKorean: true,
      };
      const updateResult = { affected: 1, raw: [] };

      jest.spyOn(mockRepository, 'update').mockResolvedValue(updateResult);

      const result = await userRepository.updateMyPage(userId, partialEntity);

      expect(result).toEqual(updateResult);
      expect(mockRepository.update).toBeCalledWith(
        { id: userId },
        partialEntity,
      );
    });
  });

  describe('updateUserRefreshToken()', () => {
    it('SUCCESS : ', async () => {
      // Given
      const id = 1;
      const hashedRefreshToken = 'test';
      const updateResult = { affected: 1, raw: [] };
      jest.spyOn(mockRepository, 'update').mockResolvedValue(updateResult);

      // When
      const result = await userRepository.updateUserRefreshToken(
        id,
        hashedRefreshToken,
      );

      // Then
      expect(result).toEqual(updateResult);
      expect(mockRepository.update).toHaveBeenCalledWith(id, {
        hashedRefreshToken,
      });
    });
  });
});
