import { RankerProfileOutput } from './../rank/dto/rankerProfile.dto';
import { User } from './../entities/User';
import { jwtConstants, cookieConstants } from './constants';
import { GithubCodeDto, SignUpWithUserNameDto } from './dto/auth.dto';
import { RankerProfile } from './../entities/RankerProfile';
import { Field } from './../entities/Field';
import { Career } from './../entities/Career';
import { RankerProfileRepository } from './../rank/rankerProfile.repository';
import { UserRepository } from './../user/user.repository';
import { RankService } from './../rank/rank.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { Test } from '@nestjs/testing';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { getRepositoryToken } from '@nestjs/typeorm';

class MockFieldRepository {}
class MockCareerRepository {}
class MockRankerProfileRepository {}
class MockUserRepository {}

const moduleMocker = new ModuleMocker(global);

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let authRepository: AuthRepository;
  let jwtService: JwtService;
  let rankService: RankService;
  let rankerProfileRepository: RankerProfileRepository;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        JwtService,
        AuthRepository,
        RankService,
        {
          provide: RankerProfileRepository,
          useClass: MockRankerProfileRepository,
        },
        {
          provide: UserRepository,
          useClass: MockUserRepository,
        },
        {
          provide: getRepositoryToken(Career),
          useClass: MockCareerRepository,
        },
        {
          provide: getRepositoryToken(Field),
          useClass: MockFieldRepository,
        },
        {
          provide: getRepositoryToken(RankerProfile),
          useClass: MockRankerProfileRepository,
        },
      ],
    })
      .useMocker((token) => {
        if (token === UserService) {
          return {
            getGithubAccessToken: jest.fn(),
            getByGithubAccessToken: jest.fn(),
            getByGithubId: jest.fn(),
            createUser: jest.fn(),
          };
        }
        if (token === JwtService) {
          return { sign: jest.fn() };
        }
        if (token === RankService) {
          return { checkRanker: jest.fn() };
        }
        if (token === RankerProfileRepository) {
          return {
            getRankerProfile: jest.fn(),
            updateRankerProfile: jest.fn(),
          };
        }
        if (token === AuthRepository) {
          return { getAuthCategory: jest.fn() };
        }
        if (token === UserRepository) {
          return {
            getUserIdByGithubId: jest.fn(),
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

    authService = moduleRef.get<AuthService>(AuthService);
    authRepository = moduleRef.get<AuthRepository>(AuthRepository);
    userService = moduleRef.get<UserService>(UserService);
    jwtService = moduleRef.get<JwtService>(JwtService);
    rankService = moduleRef.get<RankService>(RankService);
    rankerProfileRepository = moduleRef.get<RankerProfileRepository>(
      RankerProfileRepository,
    );
    userRepository = moduleRef.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signIn()', () => {
    // Given
    const githubCode: GithubCodeDto = { code: 'github_code' };
    const githubAccessToken = 'github_access_token';
    const githubUserInfo = { id: 123456, login: 'user' };
    const jwtToken = 'jwt-token';

    beforeEach(() => {
      jest
        .spyOn(userService, 'getGithubAccessToken')
        .mockResolvedValue(githubAccessToken);
      jest
        .spyOn(userService, 'getByGithubAccessToken')
        .mockResolvedValue(githubUserInfo);
    });

    it('SUCCESS : should return an object { isMember : true, accessToken, userName }', async () => {
      // Given
      const expectedResult = {
        isMember: true,
        userName: githubUserInfo.login,
        accessToken: jwtToken,
        userId: 123,
      };

      const user = new User();
      user.id = 123;

      jest.spyOn(userService, 'getByGithubId').mockResolvedValue(user);
      jest.spyOn(authService, 'getJwtAccessToken').mockResolvedValue(jwtToken);

      // When
      const result = await authService.signIn(githubCode);

      // Then
      expect(result).toEqual(expectedResult);
      expect(userService.getGithubAccessToken).toHaveBeenCalledWith(
        githubCode.code,
      );
      expect(userService.getByGithubAccessToken).toHaveBeenCalledWith(
        githubAccessToken,
      );
      expect(userService.getByGithubId).toHaveBeenCalledWith(githubUserInfo.id);
    });

    it('FAILURE : should return an object {isMember: false, userName, githubId} when the user is not registered', async () => {
      // Given
      const expectedResult = {
        isMember: false,
        userName: githubUserInfo.login,
        githubId: githubUserInfo.id,
      };

      const user = undefined;

      jest.spyOn(userService, 'getByGithubId').mockResolvedValue(user);

      // When
      const result = await authService.signIn(githubCode);

      // Then
      expect(result).toEqual(expectedResult);
      expect(userService.getGithubAccessToken).toHaveBeenCalledWith(
        githubCode.code,
      );
      expect(userService.getByGithubAccessToken).toHaveBeenCalledWith(
        githubAccessToken,
      );
      expect(userService.getByGithubId).toHaveBeenCalledWith(githubUserInfo.id);
    });
  });

  describe('signUp()', () => {
    // Given
    const signUpDataWithUserName: SignUpWithUserNameDto = {
      userName: 'user',
      githubId: 123456,
      fieldId: 1,
      careerId: 1,
      isKorean: true,
    };

    const { userName, ...signUpData } = signUpDataWithUserName;
    const user = new User();
    user.id = 1;
    user.githubId = 12345;
    const jwtToken = 'jwtToken';
    const rankerProfile = new RankerProfileOutput();

    beforeEach(() => {
      jest.spyOn(userService, 'createUser').mockResolvedValue(undefined);
      jest.spyOn(userService, 'getByGithubId').mockResolvedValue(user);
      jest.spyOn(authService, 'getJwtAccessToken').mockResolvedValue(jwtToken);
      jest.spyOn(rankService, 'checkRanker').mockResolvedValue(undefined);
      userRepository.getUserIdByGithubId = jest.fn().mockResolvedValue(user.id);
      rankerProfileRepository.getRankerProfile = jest
        .fn()
        .mockResolvedValue(rankerProfile);
      rankerProfileRepository.updateRankerProfile = jest
        .fn()
        .mockResolvedValue(undefined);
    });

    it('SUCCESS : should create a new user, sign a JWT token, and update the ranker profile and return an object { accessToken: jwtToken, userId : userId }', async () => {
      // When
      const result = await authService.signUp(signUpDataWithUserName);

      // Then
      expect(result).toEqual({ accessToken: jwtToken, userId: user.id });
      expect(userService.createUser).toHaveBeenCalledWith(signUpData);
      expect(userService.getByGithubId).toHaveBeenCalledWith(
        signUpData.githubId,
      );
      expect(authService.getJwtAccessToken).toHaveBeenCalledWith(
        user.id,
        userName,
      );
      expect(rankService.checkRanker).toHaveBeenCalledTimes(1);
      expect(userRepository.getUserIdByGithubId).toHaveBeenCalledWith(
        user.githubId,
      );
      expect(rankerProfileRepository.getRankerProfile).toHaveBeenCalledWith(
        userName,
      );
      expect(rankerProfileRepository.updateRankerProfile).toHaveBeenCalledTimes(
        1,
      );
    });
  });

  describe('getAuthCategory()', () => {
    it('SUCCESS : should return an object { fields : Field[], careers : Career[]', async () => {
      const expectedResult = { fields: [], careers: [] };
      authRepository.getAuthCategory = jest
        .fn()
        .mockResolvedValue(expectedResult);

      const result = await authService.getAuthCategory();

      expect(authRepository.getAuthCategory).toHaveBeenCalledWith();
      expect(result).toBe(expectedResult);
    });
  });

  describe('getJwtAccessToken()', () => {
    it('SUCCESS : Should return jwtToken', async () => {
      // Given
      const payload = { userId: 1, userName: 'test' };
      const jwtToken = 'test';
      const jwtOptions = {
        expiresIn: `${jwtConstants.jwtExpiresIn}s`,
        secret: jwtConstants.jwtSecret,
      };
      jest.spyOn(jwtService, 'sign').mockReturnValue(jwtToken);

      // When
      const result = await authService.getJwtAccessToken(
        payload.userId,
        payload.userName,
      );

      // Then
      expect(result).toBe(jwtToken);
      expect(jwtService.sign).toHaveBeenCalledWith(payload, jwtOptions);
    });
  });

  describe('getCookiesWithJwtRefreshToken()', () => {
    it('SUCCESS : Should return cookies With refreshToken ', async () => {
      // Given
      const userId = 1;
      const payload = { userId };
      const refreshToken = 'test';
      const jwtOptions = {
        secret: jwtConstants.jwtRefreshSecret,
        expiresIn: `${jwtConstants.jwtRefreshExpiresIn}s`,
      };

      jest.spyOn(jwtService, 'sign').mockReturnValue(refreshToken);

      const expectedResult = { refreshToken, ...cookieConstants };

      // When
      const result = await authService.getCookiesWithJwtRefreshToken(userId);

      // Then
      expect(result).toEqual(expectedResult);
      expect(jwtService.sign).toHaveBeenCalledWith(payload, jwtOptions);
    });
  });

  describe('isRefreshTokenExpirationDateHalfPast()', () => {
    it('SUCCESS : If refreshToken expiration date more than half past, should return true ', async () => {
      // Given
      const refreshToken = 'test';
      const payload = {
        exp: Date.now() + (+jwtConstants.jwtRefreshExpiresIn * 1000) / 3,
      };
      console.log(
        '+jwtConstants.jwtRefreshExpiresIn: ',
        +jwtConstants.jwtRefreshExpiresIn,
      );

      const jwtOptions = {
        secret: jwtConstants.jwtSecret,
      };
      jest.spyOn(jwtService, 'verify').mockReturnValue(payload);

      // When
      const result = await authService.isRefreshTokenExpirationDateHalfPast(
        refreshToken,
      );

      // Then
      expect(result).toBe(true);
      expect(jwtService.verify).toHaveBeenCalledWith(refreshToken, jwtOptions);
    });

    it('SUCCESS : If refreshToken expiration date less than half past, should return true ', async () => {
      // Given
      const refreshToken = 'test';
      const payload = {
        exp: Date.now() + (+jwtConstants.jwtRefreshExpiresIn * 1000 * 2) / 3,
      };
      const jwtOptions = {
        secret: jwtConstants.jwtSecret,
      };
      jest.spyOn(jwtService, 'verify').mockReturnValue(payload);

      // When
      const result = await authService.isRefreshTokenExpirationDateHalfPast(
        refreshToken,
      );

      // Then
      expect(result).toBe(false);
      expect(jwtService.verify).toHaveBeenCalledWith(refreshToken, jwtOptions);
    });
  });

  describe('getCookiesForLogOut()', () => {
    it('SUCCESS : Should return refreshOptions', async () => {
      // Given
      const { maxAge, ...refreshOptions } = cookieConstants;

      // When
      const result = await authService.getCookiesForLogOut();

      // Then
      expect(result).toEqual(refreshOptions);
    });
  });
});
