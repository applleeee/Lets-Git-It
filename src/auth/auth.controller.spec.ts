import { HttpStatus } from '@nestjs/common';
import { UserService } from './../user/user.service';
import { Test } from '@nestjs/testing';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GithubCodeDto } from './dto/auth.dto';
import { Response } from 'express';

const moduleMocker = new ModuleMocker(global);

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, UserService],
    })
      .useMocker((token) => {
        if (token === AuthService) {
          return {
            signIn: jest.fn(),
            signUp: jest.fn(),
            getAuthCategory: jest.fn(),
            getCookiesWithJwtRefreshToken: jest.fn(),
            getCookiesForLogOut: jest.fn(),
            getJwtAccessToken: jest.fn(),
            isRefreshTokenExpirationDateHalfPast: jest.fn(),
          };
        }
        if (token === UserService) {
          return {
            saveRefreshToken: jest.fn(),
            deleteRefreshToken: jest.fn(),
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
    userService = moduleRef.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn()', () => {
    const githubCodeDto = { code: 'github_code' };

    const mockCookieConstants = {
      domain: process.env.COOKIE_CLIENT_DOMAIN || 'localhost',
      path: '/',
      httpOnly: true,
      maxAge: 1000,
      sameSite: 'none' as const,
      secure: true,
      signed: true,
    };

    const mockCookieWithJwtRefreshToken = {
      refreshToken: 'test',
      ...mockCookieConstants,
    };

    const res: Response = {
      cookie: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as any;

    it('SUCCESS : Should set refresh token cookie and return an object { accessToken, userName, isMember : true }, if user is a member', async () => {
      const userInfo = {
        isMember: true,
        userName: 'user',
        accessToken: 'jwt-token',
        userId: 1,
      };
      const { userId, ...expectedResult } = userInfo;

      jest.spyOn(authService, 'signIn').mockResolvedValue(userInfo);
      jest
        .spyOn(authService, 'getCookiesWithJwtRefreshToken')
        .mockResolvedValue(mockCookieWithJwtRefreshToken);
      jest.spyOn(userService, 'saveRefreshToken').mockResolvedValue(undefined);

      await authController.signIn(githubCodeDto, res);

      expect(authService.signIn).toHaveBeenCalledWith(githubCodeDto);
      expect(authService.getCookiesWithJwtRefreshToken).toHaveBeenCalledWith(
        userId,
      );
      expect(userService.saveRefreshToken).toHaveBeenCalledTimes(1);

      expect(res.cookie).toHaveBeenCalledWith(
        'Refresh',
        mockCookieWithJwtRefreshToken.refreshToken,
        mockCookieConstants,
      );

      expect(res.json).toHaveBeenCalledWith(expectedResult);
    });

    it('FAILURE : Should return http exception 401 and an object { isMember : false, userName, githubId }', async () => {
      const expectedResult = {
        isMember: false,
        userName: 'user',
        githubId: 123456,
      };

      jest.spyOn(authService, 'signIn').mockResolvedValue(expectedResult);

      await authController.signIn(githubCodeDto, res);

      expect(authService.signIn).toHaveBeenCalledWith(githubCodeDto);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith(expectedResult);
    });
  });

  describe('signUp()', () => {
    const res: Response = {
      cookie: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as any;

    const mockCookieConstants = {
      domain: process.env.COOKIE_CLIENT_DOMAIN || 'localhost',
      path: '/',
      httpOnly: true,
      maxAge: 1000,
      sameSite: 'none' as const,
      secure: true,
      signed: true,
    };

    const mockCookieWithJwtRefreshToken = {
      refreshToken: 'test',
      ...mockCookieConstants,
    };

    it('SUCCESS : Should set refresh token cookie and return accessToken', async () => {
      const signUpDto = {
        userName: 'user',
        githubId: 123456,
        fieldId: 1,
        careerId: 1,
        isKorean: true,
      };

      const expectedResult = { accessToken: 'jwt-token', userId: 1 };

      jest.spyOn(authService, 'signUp').mockResolvedValue(expectedResult);
      jest
        .spyOn(authService, 'getCookiesWithJwtRefreshToken')
        .mockResolvedValue(mockCookieWithJwtRefreshToken);
      jest.spyOn(userService, 'saveRefreshToken').mockResolvedValue(undefined);

      await authController.signUp(signUpDto, res);

      expect(authService.signUp).toHaveBeenCalledWith(signUpDto);
      expect(authService.getCookiesWithJwtRefreshToken).toHaveBeenCalledWith(
        expectedResult.userId,
      );
      expect(userService.saveRefreshToken).toHaveBeenCalledTimes(1);

      expect(res.cookie).toHaveBeenCalledWith(
        'Refresh',
        mockCookieWithJwtRefreshToken.refreshToken,
        mockCookieConstants,
      );

      expect(res.json).toHaveBeenCalledWith({
        accessToken: expectedResult.accessToken,
      });
    });
  });

  describe('signOut()', () => {
    const mockReq = { user: { id: 1 } };
    const mockRes: Response = {
      cookie: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as any;

    const mockCookieConstants = {
      domain: process.env.COOKIE_CLIENT_DOMAIN || 'localhost',
      path: '/',
      httpOnly: true,
      sameSite: 'none' as const,
      secure: true,
      signed: true,
    };

    it('SUCCESS : Should set empty refresh token cookie', async () => {
      jest
        .spyOn(authService, 'getCookiesForLogOut')
        .mockResolvedValue(mockCookieConstants);

      jest
        .spyOn(userService, 'deleteRefreshToken')
        .mockResolvedValue(undefined);

      await authController.signOut(mockReq, mockRes);

      expect(authService.getCookiesForLogOut).toHaveBeenCalled();
      expect(userService.deleteRefreshToken).toHaveBeenCalledWith(
        mockReq.user.id,
      );

      expect(mockRes.cookie).toHaveBeenCalledWith(
        'Refresh',
        '',
        mockCookieConstants,
      );
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'LOG_OUT_COMPLETED',
      });
    });
  });

  describe('refresh()', () => {
    const mockReq = {
      signedCookies: { Refresh: 'test' },
      user: { id: 1, userName: 'test' },
    };

    const mockRes = {
      cookie: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as any;

    const accessToken = 'test';

    const mockCookieConstants = {
      domain: process.env.COOKIE_CLIENT_DOMAIN || 'localhost',
      path: '/',
      httpOnly: true,
      maxAge: 1000,
      sameSite: 'none' as const,
      secure: true,
      signed: true,
    };

    const mockCookieWithJwtRefreshToken = {
      refreshToken: 'test',
      ...mockCookieConstants,
    };

    it('SUCCESS : Should set new refresh token cookie and return accessToken, if refresh token should be regenerated ', async () => {
      jest
        .spyOn(authService, 'getJwtAccessToken')
        .mockResolvedValue(accessToken);

      jest
        .spyOn(authService, 'isRefreshTokenExpirationDateHalfPast')
        .mockResolvedValue(true);

      jest
        .spyOn(authService, 'getCookiesWithJwtRefreshToken')
        .mockResolvedValue(mockCookieWithJwtRefreshToken);

      jest.spyOn(userService, 'saveRefreshToken').mockResolvedValue(undefined);

      await authController.refresh(mockReq, mockRes);

      expect(authService.getJwtAccessToken).toHaveBeenCalledWith(
        mockReq.user.id,
        mockReq.user.userName,
      );

      expect(authService.isRefreshTokenExpirationDateHalfPast).toBeCalledWith(
        mockCookieWithJwtRefreshToken.refreshToken,
      );

      expect(authService.getCookiesWithJwtRefreshToken).toBeCalledWith(
        mockReq.user.id,
      );
      expect(userService.saveRefreshToken).toBeCalledWith(
        mockCookieWithJwtRefreshToken.refreshToken,
        mockReq.user.id,
      );

      expect(mockRes.cookie).toHaveBeenCalledWith(
        'Refresh',
        mockCookieWithJwtRefreshToken.refreshToken,
        mockCookieConstants,
      );

      expect(mockRes.json).toHaveBeenCalledWith({ accessToken });
    });

    it('SUCCESS : Should return accessToken, not set cookie ', async () => {
      jest
        .spyOn(authService, 'getJwtAccessToken')
        .mockResolvedValue(accessToken);

      jest
        .spyOn(authService, 'isRefreshTokenExpirationDateHalfPast')
        .mockResolvedValue(false);

      await authController.refresh(mockReq, mockRes);

      expect(authService.getJwtAccessToken).toHaveBeenCalledWith(
        mockReq.user.id,
        mockReq.user.userName,
      );

      expect(authService.isRefreshTokenExpirationDateHalfPast).toBeCalledWith(
        mockCookieWithJwtRefreshToken.refreshToken,
      );

      expect(mockRes.json).toHaveBeenCalledWith({ accessToken });
    });
  });

  describe('getAuthCategory()', () => {
    it('SUCCESS : Should return an object { fields : Field[], careers : Career[] }', async () => {
      const expectedResult = { fields: [], careers: [] };
      authService.getAuthCategory = jest.fn().mockResolvedValue(expectedResult);

      const result = await authController.getAuthCategory();

      expect(authService.getAuthCategory).toHaveBeenCalled();
      expect(result).toBe(expectedResult);
    });
  });
});
