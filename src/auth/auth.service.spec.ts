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
            createUser: jest.fn(),
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
    const githubCode: GithubCodeDto = { code: 'github_code' };
    const githubAccessToken = 'github_access_token';
    const githubUserInfo = { id: 123456, login: 'user' };
    const user = { id: 123, githubId: 123456 };
    const jwtToken = 'jwt-token';

    beforeEach(() => {
      userService.getGithubAccessToken = jest
        .fn()
        .mockResolvedValue(githubAccessToken);
      userService.getByGithubAccessToken = jest
        .fn()
        .mockResolvedValue(githubUserInfo);
      userService.getByGithubId = jest.fn().mockResolvedValue(user);
      jwtService.sign = jest.fn().mockReturnValue(jwtToken);
    });

    it('SUCCESS : should return an object { isMember : true, accessToken, userName }', async () => {
      const expectedResult = {
        isMember: true,
        userName: githubUserInfo.login,
        accessToken: jwtToken,
      };

      const result = await authService.signIn(githubCode);

      expect(result).toEqual(expectedResult);
    });

    it('FAILURE : should return an object {isMember: false, userName, githubId} when the user is not registered', async () => {
      userService.getByGithubId = jest.fn().mockResolvedValue(undefined);
      const expectedResult = {
        isMember: false,
        userName: githubUserInfo.login,
        githubId: githubUserInfo.id,
      };

      const result = await authService.signIn(githubCode);

      expect(result).toEqual(expectedResult);
    });

    it('Should call the UserService methods with the correct parameters', async () => {
      await authService.signIn(githubCode);

      expect(userService.getGithubAccessToken).toHaveBeenCalledWith(
        githubCode.code,
      );
      expect(userService.getByGithubAccessToken).toHaveBeenCalledWith(
        githubAccessToken,
      );
      expect(userService.getByGithubId).toHaveBeenCalledWith(githubUserInfo.id);
    });

    it('Should call the JwtService method with the correct parameters', async () => {
      await authService.signIn(githubCode);

      expect(jwtService.sign).toHaveBeenCalledWith(
        {
          userId: 123,
          userName: githubUserInfo.login,
        },
        { secret: process.env.JWT_SECRET_KEY },
      );
    });
  });

  describe('signUp()', () => {
    const signUpDataWithUserName: SignUpWithUserNameDto = {
      userName: 'user',
      githubId: 123456,
      fieldId: 1,
      careerId: 1,
      isKorean: true,
    };

    const { userName, ...signUpData } = signUpDataWithUserName;
    const user = { id: 1, ...signUpData };
    const jwtToken = 'jwtToken';

    beforeEach(() => {
      userService.createUser = jest.fn().mockResolvedValue(undefined);
      userService.getByGithubId = jest.fn().mockResolvedValue(user);
      jwtService.sign = jest.fn().mockReturnValue(jwtToken);
      rankService.checkRanker = jest.fn().mockResolvedValue(undefined);
      userRepository.getUserIdByGithubId = jest.fn().mockResolvedValue(user.id);
      rankerProfileRepository.getRankerProfile = jest.fn().mockResolvedValue({
        profileImage: 'profileImage',
        blog: 'blog',
        email: 'email',
        company: 'company',
        region: 'region',
        userId: user.id,
      });
      rankerProfileRepository.updateRankerProfile = jest
        .fn()
        .mockResolvedValue(undefined);
    });

    it('SUCCESS : should create a new user, sign a JWT token, and update the ranker profile and return an object { accessToken: jwtToken }', async () => {
      const result = await authService.signUp(signUpDataWithUserName);
      expect(result).toEqual({ accessToken: jwtToken });
    });

    it('Should call the UserService methods with the correct parameters', async () => {
      await authService.signUp(signUpDataWithUserName);

      expect(userService.createUser).toHaveBeenCalledWith(signUpData);
      expect(userService.getByGithubId).toHaveBeenCalledWith(
        signUpData.githubId,
      );
    });

    it('Should call the JwtService methods with the correct parameters', async () => {
      await authService.signUp(signUpDataWithUserName);

      expect(jwtService.sign).toHaveBeenCalledWith(
        {
          userId: user.id,
          userName: userName,
        },
        { secret: process.env.JWT_SECRET_KEY },
      );
    });

    it('Should call the RankService methods with the correct parameters', async () => {
      await authService.signUp(signUpDataWithUserName);

      expect(rankService.checkRanker).toHaveBeenCalledWith(userName);
    });

    it('Should call the UserRepository methods with the correct parameters', async () => {
      await authService.signUp(signUpDataWithUserName);

      expect(userRepository.getUserIdByGithubId).toHaveBeenCalledWith(
        user.githubId,
      );
    });

    it('Should call the RankerProfileRepository methods with the correct parameters', async () => {
      await authService.signUp(signUpDataWithUserName);

      expect(rankerProfileRepository.getRankerProfile).toHaveBeenCalledWith(
        userName,
      );
      expect(rankerProfileRepository.updateRankerProfile).toHaveBeenCalledWith(
        userName,
        'profileImage',
        'blog',
        'email',
        'company',
        'region',
        user.id,
      );
    });
  });

  describe('getAuthCategory()', () => {
    it('SUCCESS : should return an object { fields : Field[], careers : Career[]', async () => {
      const expectedResult = { fields: [], careers: [] };
      authRepository.getAuthCategory = jest
        .fn()
        .mockResolvedValue(expectedResult);

      const result = await authRepository.getAuthCategory();

      expect(authRepository.getAuthCategory).toHaveBeenCalledWith();
      expect(result).toBe(expectedResult);
    });
  });
});
