import { pbkdf2, pbkdf2Sync } from 'crypto';
import { promisify } from 'util';
import { SignUpDto } from './dto/createUser.dto';
import { User } from './../entities/User';
import { CommunityRepository } from './../community/community.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { RankerProfileRepository } from '../rank/rankerProfile.repository';
import { HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { UpdateMyPageDto } from './dto/mypage.dto';
import { of, map, lastValueFrom } from 'rxjs';
import { AxiosResponse, AxiosRequestConfig } from 'axios';

class MockUserRepository {
  getByGithubId = jest.fn();
  getByUserId = jest.fn();
  createUser = jest.fn();
  updateMyPage = jest.fn();
  updateUserRefreshToken = jest.fn();
}

class MockRankerProfileRepository {
  getMyPage = jest.fn();
  getUserTier = jest.fn();
  getUserNameByUserId = jest.fn();
}

class MockCommunityRepository {
  getPostsCreatedByUser = jest.fn();
}
class MockHttpService {
  post = jest.fn();
  get = jest.fn();
}

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let rankerProfileRepository: RankerProfileRepository;
  let communityRepository: CommunityRepository;
  let http: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useClass: MockUserRepository,
        },
        {
          provide: RankerProfileRepository,
          useClass: MockRankerProfileRepository,
        },
        {
          provide: HttpService,
          useClass: MockHttpService,
        },
        {
          provide: CommunityRepository,
          useClass: MockCommunityRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
    rankerProfileRepository = module.get<RankerProfileRepository>(
      RankerProfileRepository,
    );
    communityRepository = module.get<CommunityRepository>(CommunityRepository);
    http = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('getByGithubId()', () => {
    it('SUCCESS : should return a user by their github iD', async () => {
      const mockUser = new User();
      const githubId = 1;

      jest.spyOn(userRepository, 'getByGithubId').mockResolvedValue(mockUser);

      const result = await userService.getByGithubId(githubId);

      expect(userRepository.getByGithubId).toHaveBeenCalledWith(githubId);
      expect(result).toBe(mockUser);
    });
  });

  describe('getById()', () => {
    it('SUCCESS : should return a user by their id', async () => {
      const mockUser = new User();
      const userId = 1;

      jest.spyOn(userRepository, 'getByUserId').mockResolvedValue(mockUser);

      const result = await userService.getById(userId);

      expect(userRepository.getByUserId).toHaveBeenCalledWith(userId);
      expect(result).toBe(mockUser);
    });
  });

  describe('getGithubAccessToken()', () => {
    const code = 'test';
    const accessToken = 'accessToken';

    const requestBody = {
      code,
      client_id: 'test',
      client_secret: 'GITHUB_CLIENT_SECRETS',
    };

    const config: AxiosRequestConfig = {
      headers: {
        accept: 'application/json',
      },
    };

    it('SUCCESS : Should return a GitHub access token', async () => {
      jest.spyOn(http, 'post').mockImplementation(() =>
        of({
          data: { access_token: accessToken },
        } as AxiosResponse),
      );

      const result = await lastValueFrom(
        http
          .post(
            `https://github.com/login/oauth/access_token`,
            requestBody,
            config,
          )
          .pipe(map((res) => res.data?.access_token)),
      );

      await userService.getGithubAccessToken(code);

      expect(result).toBe(accessToken);
      expect(http.post).toHaveBeenCalledWith(
        `https://github.com/login/oauth/access_token`,
        requestBody,
        config,
      );
    });

    it('FAILURE : Should throw an http exception if the access token is undefined', async () => {
      jest.spyOn(http, 'post').mockImplementation(() =>
        of({
          data: { access_token: undefined },
        } as AxiosResponse),
      );

      try {
        const result = await lastValueFrom(
          http
            .post(
              `https://github.com/login/oauth/access_token`,
              requestBody,
              config,
            )
            .pipe(map((res) => res.data.access_token)),
        );

        if (result === undefined) {
          return await userService.getGithubAccessToken(code);
        }
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toBe('WRONG_GITHUB_CODE');
      }

      expect(http.post).toHaveBeenCalledWith(
        `https://github.com/login/oauth/access_token`,
        requestBody,
        config,
      );
    });
  });

  describe('getByGithubAccessToken()', () => {
    const githubAccessToken = 'accessToken';
    const githubUser = { id: 123, login: 'user' };

    const config: AxiosRequestConfig = {
      headers: {
        accept: 'application/json',
        Authorization: `token ${githubAccessToken}`,
      },
    };

    it('SUCCESS : Should return the user object from github API', async () => {
      jest.spyOn(http, 'get').mockImplementation(() =>
        of({
          data: githubUser,
        } as AxiosResponse),
      );

      const result = await lastValueFrom(
        http
          .get(`https://api.github.com/user`, config)
          .pipe(map((res) => res.data)),
      );

      await userService.getByGithubAccessToken(githubAccessToken);

      expect(result).toEqual(githubUser);

      expect(http.get).toHaveBeenCalledWith(
        `https://api.github.com/user`,
        config,
      );
    });

    it('FAILURE : should throw an HttpException if the github access token is invalid', async () => {
      const invalidAccessToken = 'invalidAccessToken';

      jest.spyOn(http, 'get').mockImplementation(() =>
        of({
          data: undefined,
        } as AxiosResponse),
      );

      try {
        const result = await lastValueFrom(
          http
            .get(`https://api.github.com/user`, config)
            .pipe(map((res) => res.data)),
        );

        if (result === undefined) {
          return await userService.getByGithubAccessToken(invalidAccessToken);
        }
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.UNAUTHORIZED);
        expect(err.message).toBe('WRONG_GITHUB_ACCESS_TOKEN');
      }

      expect(http.get).toHaveBeenCalledWith(
        `https://api.github.com/user`,
        config,
      );
    });
  });

  describe('createUser()', () => {
    it('Should call userRepository.createUser with the correct arguments', async () => {
      const signUpData: SignUpDto = {
        githubId: 1,
        fieldId: 1,
        careerId: 1,
        isKorean: true,
      };

      const userRepositoryCreateUserSpy = jest.spyOn(
        userRepository,
        'createUser',
      );

      await userService.createUser(signUpData);

      expect(userRepositoryCreateUserSpy).toHaveBeenCalledWith(signUpData);
    });
  });

  describe('getMyPage()', () => {
    const userId = 1;

    const ranker = {
      name: 'user',
      profileImageUrl: 'img',
      profileText: 'text',
      email: 'email',
    };

    const user = {
      careerId: 1,
      fieldId: 2,
      isKorean: true,
    };

    const posts = [
      { id: 1, title: 'test', subCategory: '자유', createdAt: new Date() },
    ];

    const tier = {
      tierName: 'gold',
      tierImage: 'image',
    };

    it('SUCCESS : should return the correct MyPageDto', async () => {
      const expectedMyPageDto = {
        userName: ranker.name,
        careerId: user.careerId,
        email: ranker.email,
        fieldId: user.fieldId,
        isKorean: user.isKorean,
        posts: posts,
        profileImageUrl: ranker.profileImageUrl,
        profileText: ranker.profileText,
        tierName: tier.tierName,
        tierImage: tier.tierImage,
      };

      jest
        .spyOn(rankerProfileRepository, 'getMyPage')
        .mockResolvedValueOnce([ranker]);
      jest
        .spyOn(userRepository, 'getByUserId')
        .mockResolvedValueOnce(user as User);
      jest
        .spyOn(communityRepository, 'getPostsCreatedByUser')
        .mockResolvedValueOnce(posts as any);

      jest
        .spyOn(rankerProfileRepository, 'getUserTier')
        .mockResolvedValueOnce(tier);

      const result = await userService.getMyPage(userId);

      expect(rankerProfileRepository.getMyPage).toHaveBeenCalledWith(userId);
      expect(userRepository.getByUserId).toHaveBeenCalledWith(userId);
      expect(communityRepository.getPostsCreatedByUser).toHaveBeenCalledWith(
        userId,
      );
      expect(rankerProfileRepository.getUserTier).toHaveBeenCalledWith(
        ranker.name,
      );
      expect(result).toEqual(expectedMyPageDto);
    });
  });

  describe('updateMyPage()', () => {
    it('Should call userRepository.updateMyPage with the correct arguments', async () => {
      const userId = 1;
      const partialEntity: UpdateMyPageDto = {
        fieldId: 1,
        careerId: 1,
        isKorean: true,
      };
      const updateResult = { affected: 1, raw: [] };

      jest
        .spyOn(userRepository, 'updateMyPage')
        .mockResolvedValue(updateResult as any);

      const result = await userService.updateMyPage(userId, partialEntity);

      expect(result).toEqual(updateResult);
      expect(userRepository.updateMyPage).toHaveBeenCalledWith(
        userId,
        partialEntity,
      );
    });
  });

  describe('saveRefreshToken()', () => {
    it('SUCCESS : Should save hashed refresh token for given user', async () => {
      // Given;
      const refreshToken = 'test';
      const userId = 1;
      const salt = process.env.REFRESH_SALT;
      const iterations = +process.env.REFRESH_ITERATIONS;
      const keylen = +process.env.REFRESH_KEYLEN;
      const digest = process.env.REFRESH_DIGEST;
      const mockPbkdf2 = jest.fn(pbkdf2);
      const pbkdf2Promise = promisify(mockPbkdf2);
      const key = await pbkdf2Promise(
        refreshToken,
        salt,
        iterations,
        keylen,
        digest,
      );
      const updateResult = { affected: 1, raw: [] };

      const hashedRefreshToken = key.toString('base64');

      jest
        .spyOn(userRepository, 'updateUserRefreshToken')
        .mockResolvedValue(updateResult as any);

      // When
      const result = await userService.saveRefreshToken(refreshToken, userId);

      // Then
      expect(result).toEqual(updateResult);
      expect(userRepository.updateUserRefreshToken).toHaveBeenCalledWith(
        userId,
        hashedRefreshToken,
      );
    });
  });

  describe('getUserIfRefreshTokenMatches()', () => {
    const user = new User();
    const id = 1;
    user.id = id;
    user.hashedRefreshToken = 'test';
    const refreshToken = 'test';
    const userName = 'test';

    beforeEach(async () => {
      jest.spyOn(userService, 'getById').mockResolvedValue(user);
    });

    it('SUCCESS : Should return an object id, userName}, if refreshToken is matched', async () => {
      // Given
      jest.spyOn(userService, 'verifyRefreshToken').mockResolvedValue(true);
      jest
        .spyOn(rankerProfileRepository, 'getUserNameByUserId')
        .mockResolvedValue(userName);

      const expectedResult = { id, userName };
      // When
      const result = await userService.getUserIfRefreshTokenMatches(
        refreshToken,
        id,
      );

      // Then
      expect(result).toEqual(expectedResult);
      expect(userService.getById).toHaveBeenCalledWith(id);
      expect(userService.verifyRefreshToken).toHaveBeenCalledWith(
        user.hashedRefreshToken,
        refreshToken,
      );
      expect(rankerProfileRepository.getUserNameByUserId).toHaveBeenCalledWith(
        id,
      );
    });

    it('FAILURE : Should throw HttpException 401, if refreshToken in not matched', async () => {
      // Given
      jest.spyOn(userService, 'verifyRefreshToken').mockResolvedValue(false);

      // When
      try {
        await userService.getUserIfRefreshTokenMatches(refreshToken, id);
      } catch (error) {
        // Then
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.UNAUTHORIZED);
        expect(error.message).toBe('UNAUTHORIZED');
      }

      expect(userService.getById).toHaveBeenCalledWith(id);
      expect(userService.verifyRefreshToken).toHaveBeenCalledWith(
        user.hashedRefreshToken,
        refreshToken,
      );
    });
  });

  describe('verifyRefreshToken()', () => {
    beforeAll(() => {
      // set up process.env variables for testing
      process.env.REFRESH_SALT = 'testSalt';
      process.env.REFRESH_ITERATIONS = '1000';
      process.env.REFRESH_KEYLEN = '64';
      process.env.REFRESH_DIGEST = 'sha512';
    });

    afterAll(() => {
      // clean up process.env variables after testing
      delete process.env.REFRESH_SALT;
      delete process.env.REFRESH_ITERATIONS;
      delete process.env.REFRESH_KEYLEN;
      delete process.env.REFRESH_DIGEST;
    });

    it('SUCCESS : Should return true, if refreshToken is matched ', async () => {
      // Given
      const currentRefreshToken = 'test';
      const hashedRefreshToken = pbkdf2Sync(
        currentRefreshToken,
        process.env.REFRESH_SALT,
        +process.env.REFRESH_ITERATIONS,
        +process.env.REFRESH_KEYLEN,
        process.env.REFRESH_DIGEST,
      ).toString('base64');

      // When
      const result = await userService.verifyRefreshToken(
        hashedRefreshToken,
        currentRefreshToken,
      );
      // Then
      expect(result).toBe(true);
    });

    it('FAILURE : Should throw HttpException 401, if refreshToken is not matched', async () => {
      // Given
      const currentRefreshToken = 'test';
      const lastRefreshToken = 'past';
      const hashedRefreshToken = pbkdf2Sync(
        lastRefreshToken,
        process.env.REFRESH_SALT,
        +process.env.REFRESH_ITERATIONS,
        +process.env.REFRESH_KEYLEN,
        process.env.REFRESH_DIGEST,
      ).toString('base64');

      // When
      try {
        await userService.verifyRefreshToken(
          hashedRefreshToken,
          currentRefreshToken,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.UNAUTHORIZED);
        expect(error.message).toBe('UNAUTHORIZED');
      }
    });
  });

  describe('deleteRefreshToken()', () => {
    it('SUCCESS : Should delete hashedRefreshToken In Database', async () => {
      // Given
      const id = 1;
      const updateResult = { affected: 1, raw: [] };
      jest
        .spyOn(userRepository, 'updateUserRefreshToken')
        .mockResolvedValue(updateResult as any);
      // When
      const result = await userService.deleteRefreshToken(id);

      // Then
      expect(result).toEqual(updateResult);
      expect(userRepository.updateUserRefreshToken).toHaveBeenCalledWith(
        id,
        null,
      );
    });
  });
});
