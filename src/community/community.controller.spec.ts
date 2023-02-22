import { Test } from '@nestjs/testing';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { HttpStatus } from '@nestjs/common';

const moduleMocker = new ModuleMocker(global);

describe('CommunityController', () => {
  let communityController: CommunityController;
  let communityService: CommunityService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CommunityController],
      providers: [CommunityService],
    })
      .useMocker((token) => {
        if (token === CommunityService) {
          return {
            getAllCategories: jest.fn(),
            sigsaveImageToS3nUp: jest.fn(),
            deleteImageInS3: jest.fn(),
            createPost: jest.fn(),
            getPostToUpdate: jest.fn(),
            updatePost: jest.fn(),
            deletePost: jest.fn(),
            getPostList: jest.fn(),
            getPostDetail: jest.fn(),
            createOrDeletePostLike: jest.fn(),
            searchPost: jest.fn(),
            createComment: jest.fn(),
            deleteComment: jest.fn(),
            updateComment: jest.fn(),
            getComments: jest.fn(),
            createOrDeleteCommentLikes: jest.fn(),
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

    communityController =
      moduleRef.get<CommunityController>(CommunityController);
    communityService = moduleRef.get<CommunityService>(CommunityService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(communityController).toBeDefined();
  });

  describe('getAllCategories', () => {
    it('SUCCESS : should return an array of categories', async () => {
      const expectedResult = [
        { id: 1, name: 'category1', mainCategoryId: 1 },
        { id: 2, name: 'category2', mainCategoryId: 2 },
      ];
      communityService.getAllCategories = jest
        .fn()
        .mockResolvedValue(expectedResult);

      const result = await communityController.getAllCategories();

      expect(result).toEqual(expectedResult);
    });
  });

  describe('saveImageToS3', () => {
    const mockImage = {
      fieldname: 'image',
      originalname: 'test.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('test'),
    };
    const mockReq = { user: 1 };

    it('SUCCESS : should return the URL of the uploaded image', async () => {
      const expectedResult =
        'https://test.com/post_image/1_2023-02-20_14-58-01';
      communityService.saveImageToS3 = jest
        .fn()
        .mockResolvedValue(expectedResult);

      const result = await communityController.saveImageToS3(
        mockImage as any,
        mockReq,
      );

      expect(result).toEqual(expectedResult);
    });

    it('FAILURE : should return internal server error', async () => {
      const mockError = new Error('S3_UPLOAD_FAILED');
      communityService.saveImageToS3 = jest.fn().mockRejectedValue(mockError);

      try {
        await communityController.saveImageToS3(mockImage as any, mockReq);
      } catch (err) {
        expect(err.message).toEqual('S3_UPLOAD_FAILED');
        expect(err.status).toEqual(500);
      }
    });
  });
});
