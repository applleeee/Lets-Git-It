import { Test, TestingModule } from '@nestjs/testing';
import { CommunityRepository } from './community.repository';
import { CommunityService } from './community.service';
import * as aws from '../utiles/aws';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreatePostDto, DeleteImageDto } from './dto/Post.dto';
import { Post } from 'src/entities/Post';

class MockCommunityRepository {
  getAllCategories = jest.fn();
  createPost = jest.fn();
  getPostById = jest.fn();
  updatePost = jest.fn();
  deletePost = jest.fn();
  getPostList = jest.fn();
  getPostDatail = jest.fn();
  createOrDeletePostLike = jest.fn();
  searchPost = jest.fn();
  getPostsCreatedByUser = jest.fn();
  getIdsOfPostLikedByUser = jest.fn();
  createComment = jest.fn();
  deleteComment = jest.fn();
  updateComment = jest.fn();
  isCommentExist = jest.fn();
  readComments = jest.fn();
  createOrDeleteCommentLikes = jest.fn();
  getCommentsCreatedByUser = jest.fn();
  getIdsOfCommentLikedByUser = jest.fn();
}

jest.mock('../utiles/aws', () => ({
  getS3Data: jest.fn(),
  uploadToS3: jest.fn(),
  deleteS3Data: jest.fn(),
}));

describe('CommunityService', () => {
  let communityService: CommunityService;
  let communityRepository: CommunityRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommunityService,
        {
          provide: CommunityRepository,
          useClass: MockCommunityRepository,
        },
      ],
    }).compile();

    communityService = module.get<CommunityService>(CommunityService);
    communityRepository = module.get<CommunityRepository>(CommunityRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(communityService).toBeDefined();
  });

  describe('getAllCategories', () => {
    it('SUCCESS : should return an array of categories', async () => {
      // Arrange
      const expectedResult = [
        { id: 1, name: 'category1', mainCategoryId: 1 },
        { id: 2, name: 'category2', mainCategoryId: 2 },
      ];

      communityRepository.getAllCategories = jest
        .fn()
        .mockResolvedValue(expectedResult);

      // Act
      const result = await communityService.getAllCategories();

      // Assert
      expect(result).toEqual(expectedResult);
    });
  });

  describe('saveImageToS3', () => {
    // Arrange
    const mockImage = {
      fieldname: 'image',
      originalname: 'test.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('test'),
    };
    const mockUserId = 1;

    it('SUCCESS : should create file name and uplaod to s3 and return s3 file path', async () => {
      // Arrange
      const expectedResult = 'https://example.com/image.png';
      (aws.uploadToS3 as jest.Mock).mockResolvedValue({
        Location: expectedResult,
      });

      // Act
      const result = await communityService.saveImageToS3(
        mockImage,
        mockUserId,
      );

      // Assert
      expect(result).toEqual(expectedResult);
    });

    it('FAILURE : should return internal server error when fail to upload image to s3', async () => {
      // Arrange
      const mockError = new Error();
      (aws.uploadToS3 as jest.Mock).mockRejectedValue(mockError);

      try {
        // Act
        await communityService.saveImageToS3(mockImage, mockUserId);
      } catch (err) {
        // Assert
        expect(err.status).toEqual(500);
        expect(err.message).toEqual('CANNOT_SAVE_IMAGE_TO_S3');
      }
    });
  });

  describe('deleteImageInS3', () => {
    it('SUCCESS : should delete image in s3', async () => {
      // Arrange
      const mockImageData: DeleteImageDto = {
        toDeleteImage: ['filepath/image'],
      };
      (aws.deleteS3Data as jest.Mock).mockResolvedValue('image deleted');
      const expectedResult = 'image deleted';

      // Act
      const result = await communityService.deleteImageInS3(mockImageData);

      // Assert
      expect(result).toEqual(expectedResult);
    });

    it('SUCCESS : should return message when there is no image to delete', async () => {
      // Arrange
      const mockImageData: DeleteImageDto = {
        toDeleteImage: [],
      };
      const expectedResult = { message: 'No image to delete' };

      // Act
      const result = await communityService.deleteImageInS3(mockImageData);

      // Assert
      expect(result).toEqual(expectedResult);
    });

    it('FAILURE : should return internal server error when fail to delete image in s3', async () => {
      // Arrange
      const mockImageData: DeleteImageDto = {
        toDeleteImage: ['filepath/image'],
      };
      const mockError = new Error();
      (aws.deleteS3Data as jest.Mock).mockRejectedValue(mockError);

      try {
        // Act
        await communityService.deleteImageInS3(mockImageData);
      } catch (err) {
        // Assert
        expect(err.status).toEqual(500);
        expect(err.message).toEqual('CANNOT_DELETE_IMAGE_IN_S3');
      }
    });
  });

  describe('createPost', () => {
    const mockPostData: CreatePostDto = {
      title: 'test',
      subCategoryId: 1,
      content: '<p>test</p>',
    };
    const mockUserId = 1;
    it('SUCCESS : should upload post to s3 and create new post in DB', async () => {
      // Arrange
      const now = new Date(+new Date() + 3240 * 10000)
        .toISOString()
        .replace('T', '_')
        .replace(/\..*/, '')
        .replace(/\:/g, '-');

      const mockUploadS3 = (aws.uploadToS3 as jest.Mock).mockResolvedValue(
        'post uploaded',
      );
      const mockCreatePost = (communityRepository.createPost = jest
        .fn()
        .mockResolvedValue('post created'));

      // Act
      await communityService.createPost(mockPostData, mockUserId);

      // Assert
      expect(mockUploadS3).toHaveBeenCalledWith(
        mockPostData.content,
        `post/${mockUserId}_${mockPostData.title}_${now}`,
        'string',
      );
      expect(mockCreatePost).toHaveBeenCalledWith(
        mockPostData.title,
        mockUserId,
        mockPostData.subCategoryId,
        `post/${mockUserId}_${mockPostData.title}_${now}`,
      );
    });

    it('FAILURE : should return internal server error when fail to upload post to s3', async () => {
      // Arrange
      const mockError = new Error();
      (aws.uploadToS3 as jest.Mock).mockRejectedValue(mockError);

      try {
        // Act
        await communityService.createPost(mockPostData, mockUserId);
      } catch (err) {
        // Assert
        expect(err.status).toEqual(500);
        expect(err.message).toEqual('CANNOT_UPLOAD_POST_TO_S3');
      }
    });
  });

  describe('getPostToUpdate', () => {
    it('SUCCESS : should get detail data about the post from s3 and return it', async () => {
      // Arrange
      const mockPostId = 1;
      const mockPostData = {
        contentUrl: 'test/filepath',
      };

      const mockS3Data = '<p>test</p>';

      communityRepository.getPostById = jest
        .fn()
        .mockResolvedValue(mockPostData);
      (aws.getS3Data as jest.Mock).mockResolvedValue(mockS3Data);

      const expectedPostData = {
        content: mockS3Data,
      };

      // Act
      const result = await communityService.getPostToUpdate(mockPostId);

      // Assert
      expect(result).toEqual(expectedPostData);
    });
  });
});
