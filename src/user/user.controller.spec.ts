import { HttpService } from '@nestjs/axios';
import { UserRepository } from './user.repository';
import { RankerProfileRepository } from './../rank/rankerProfile.repository';
import { CommunityRepository } from './../community/community.repository';
import { Test } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UpdateMyPageDto } from './dto/myPage.dto';

class MockUserRepository {}
class MockRankerProfileRepository {}
class MockCommunityRepository {}
class MockHttpService {}

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        { provide: UserRepository, useClass: MockUserRepository },
        {
          provide: RankerProfileRepository,
          useClass: MockRankerProfileRepository,
        },
        { provide: CommunityRepository, useClass: MockCommunityRepository },
        { provide: HttpService, useClass: MockHttpService },
      ],
    }).compile();

    userController = moduleRef.get<UserController>(UserController);
    userService = moduleRef.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('getMyPage()', () => {
    it('SUCCESS : should return user data for authenticated user', async () => {
      // Arrange
      const userId = 1;
      const expectedUser = {
        id: userId,
        userName: 'user',
        profileText: 'test',
        profileImageUrl: 'image',
        email: 'email',
        careerId: 1,
        fieldId: 1,
        isKorean: true,
        tierName: 'gold',
        tierImage: 'image',
        posts: [
          {
            title: 'tests',
            contentUrl: 'test',
            subCategoryId: 4,
            createdAt: new Date(),
          },
        ],
      };
      jest.spyOn(userService, 'getMyPage').mockResolvedValue(expectedUser);

      // Act
      const req = { user: { id: userId } };
      const result = await userController.getMyPage(req);

      // Assert
      expect(result).toEqual(expectedUser);
    });
  });

  describe('updateMyPage()', () => {
    it('SUCCESS : should update user data for authenticated user', async () => {
      // Arrange
      const userId = 1;
      const updateDto: UpdateMyPageDto = {
        fieldId: 1,
        careerId: 1,
        isKorean: true,
      };
      const expectedResponse = { message: 'USER_INFO_UPDATED' };
      jest.spyOn(userService, 'updateMyPage').mockReturnValue(undefined);

      // Act
      const req = { user: { id: userId } };
      const result = await userController.updateMyPage(updateDto, req);

      // Assert
      expect(result).toEqual(expectedResponse);
    });
  });
});
