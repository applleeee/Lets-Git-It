import { Test } from '@nestjs/testing';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GithubCodeDto } from './dto/auth.dto';

const moduleMocker = new ModuleMocker(global);

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .useMocker((token) => {
        if (token === AuthService) {
          return {
            signIn: jest.fn(),
            signUp: jest.fn(),
            getAuthCategory: jest.fn(),
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

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signIn()', () => {
    it('SUCCESS : should return an object { accessToken, userName, isMember : true }', async () => {
      const githubCodeDto = { code: 'github_code' };
      const expectedResult = {
        isMember: true,
        userName: 'user',
        accessToken: 'jwt-token',
      };
      authService.signIn = jest.fn().mockResolvedValue(expectedResult);

      const result = await authController.signIn(githubCodeDto);

      expect(authService.signIn).toHaveBeenCalledWith(githubCodeDto);
      expect(result).toBe(expectedResult);
    });

    it('FAILURE : should return an object { isMember : false, userName, githubId }', async () => {
      const githubCodeDto: GithubCodeDto = { code: 'github_code' };
      const expectedResult = {
        isMember: false,
        userName: 'user',
        githubId: 123456,
      };
      authService.signIn = jest.fn().mockResolvedValue(expectedResult);

      const result = await authController.signIn(githubCodeDto);

      expect(authService.signIn).toHaveBeenCalledWith(githubCodeDto);
      expect(result).toBe(expectedResult);
    });
  });

  describe('signUp()', () => {
    it('SUCCESS : should return accessToken', async () => {
      const signUpDto = {
        userName: 'user',
        githubId: 123456,
        fieldId: 1,
        careerId: 1,
        isKorean: true,
      };
      const expectedResult = { accessToken: 'jwt-token' };
      authService.signUp = jest.fn().mockResolvedValue(expectedResult);

      const result = await authController.signUp(signUpDto);

      expect(authService.signUp).toHaveBeenCalledWith(signUpDto);
      expect(result).toBe(expectedResult);
    });
  });

  describe('getAuthCategory()', () => {
    it('SUCCESS : should return an object { fields : Field[], careers : Career[] }', async () => {
      const expectedResult = { fields: [], careers: [] };
      authService.getAuthCategory = jest.fn().mockResolvedValue(expectedResult);

      const result = await authController.getAuthCategory();

      expect(authService.getAuthCategory).toHaveBeenCalled();
      expect(result).toBe(expectedResult);
    });
  });
});
