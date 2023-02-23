import { CommentLike } from './../entities/CommentLike';
import {
  CreateCommentDto,
  CreateOrDeleteCommentLikesDto,
  DeleteCommentDto,
  UpdateCommentDto,
} from './dto/comment.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { CommunityRepository } from './community.repository';
import { CommunityService } from './community.service';
import * as aws from '../utiles/aws';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreatePostDto, DeleteImageDto } from './dto/Post.dto';

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
  getComments = jest.fn();
  getReComments = jest.fn();
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

  describe('getIdsOfPostsCreatedByUser()', () => {
    const mockUserId = 1;

    it('SUCCESS : Should return array of post ids created by user', async () => {
      const postsCreatedByUser = [
        { id: 1, title: test, SubCategory: 4, createdAt: new Date() },
      ];
      const expectedResult = postsCreatedByUser?.map(
        (item) => Object.values(item)[0],
      );

      communityRepository.getPostsCreatedByUser = jest
        .fn()
        .mockResolvedValue(postsCreatedByUser);

      const result = await communityService.getIdsOfPostsCreatedByUser(
        mockUserId,
      );

      expect(result).toEqual(expectedResult);
      expect(communityRepository.getPostsCreatedByUser).toHaveBeenCalledWith(
        mockUserId,
      );
    });
  });

  describe('getIdsOfPostLikedByUser()', () => {
    const mockUserId = 1;

    it('SUCCESS : Should return array of like(about post) ids created by user', async () => {
      const likesCreatedByUser = [{ post: { id: 1 } }];
      const expectedResult = likesCreatedByUser?.map(
        (item) => Object.values(item)[0],
      );

      communityRepository.getIdsOfPostLikedByUser = jest
        .fn()
        .mockResolvedValue(likesCreatedByUser);

      const result = await communityService.getIdsOfPostLikedByUser(mockUserId);

      expect(result).toEqual(expectedResult);
      expect(communityRepository.getIdsOfPostLikedByUser).toHaveBeenCalledWith(
        mockUserId,
      );
    });
  });

  describe('getComments()', () => {
    const mockPostId = 1;

    // 댓글이 없는 경우
    it('SUCCESS : Should return array of comments, either when authenticated or unauthenticated ', async () => {
      const expectedResult = [];
      const mockUser = {
        id: 1,
        idsOfPostsCreatedByUser: [],
        idsOfPostLikedByUser: [],
        idsOfCommentsCreatedByUser: [],
        idsOfCommentLikedByUser: [],
      };

      communityRepository.getComments = jest
        .fn()
        .mockResolvedValue(expectedResult);

      const result = await communityService.getComments(mockUser, mockPostId);

      expect(result).toEqual(expectedResult);
      expect(communityRepository.getComments).toHaveBeenCalledWith(mockPostId);
    });
    describe('- When authenticated', () => {
      // 댓글만 있고 로그인 한 경우
      it('SUCCESS : Should return array include not reComment but comments , when authenticated', async () => {
        const expectedResult = [
          {
            commentId: 1,
            content: 'test 1',
            groupOrder: 1,
            isCreatedByUser: true,
            isLikedByUser: false,
            reComments: [],
          },
          {
            commentId: 2,
            content: 'test 2',
            groupOrder: 2,
            isCreatedByUser: false,
            isLikedByUser: true,
            reComments: [],
          },
        ];

        const mockComments = [
          { commentId: 1, content: 'test 1', groupOrder: 1 },
          { commentId: 2, content: 'test 2', groupOrder: 2 },
        ] as any[];

        const mockUser = {
          id: 1,
          idsOfPostsCreatedByUser: [],
          idsOfPostLikedByUser: [],
          idsOfCommentsCreatedByUser: [1],
          idsOfCommentLikedByUser: [2],
        };

        communityRepository.getComments = jest
          .fn()
          .mockResolvedValue(mockComments);

        const result = await communityService.getComments(mockUser, mockPostId);

        expect(result).toEqual(expectedResult);
        expect(communityRepository.getComments).toHaveBeenCalledWith(
          mockPostId,
        );
      });

      // 댓글과 대댓글이 같이 있고 로그인 한 경우
      it('SUCCESS : Should return array include comments and reComments, when authenticated', async () => {
        const expectedResult = [
          {
            commentId: 1,
            content: 'test comment 1',
            groupOrder: 1,
            isCreatedByUser: true,
            isLikedByUser: false,
            reComments: [
              {
                commentId: 2,
                content: 'test reComment 2',
                groupOrder: 1,
                isCreatedByUser: false,
                isLikedByUser: true,
              },
              {
                commentId: 6,
                content: 'test reComment 6',
                groupOrder: 1,
                isCreatedByUser: true,
                isLikedByUser: false,
              },
            ],
          },
          {
            commentId: 3,
            content: 'test comment 3',
            groupOrder: 2,
            isCreatedByUser: false,
            isLikedByUser: true,
            reComments: [
              {
                commentId: 4,
                content: 'test reComment 4',
                groupOrder: 2,
                isCreatedByUser: true,
                isLikedByUser: false,
              },
              {
                commentId: 5,
                content: 'test reComment 5',
                groupOrder: 2,
                isCreatedByUser: false,
                isLikedByUser: true,
              },
            ],
          },
          {
            commentId: 7,
            content: 'test comment 7',
            groupOrder: 3,
            isCreatedByUser: false,
            isLikedByUser: false,
            reComments: [],
          },
        ];

        const mockComments = [
          { commentId: 1, content: 'test comment 1', groupOrder: 1 },
          { commentId: 3, content: 'test comment 3', groupOrder: 2 },
          { commentId: 7, content: 'test comment 7', groupOrder: 3 },
        ] as any[];

        const mockReComments = [
          { commentId: 2, content: 'test reComment 2', groupOrder: 1 },
          { commentId: 6, content: 'test reComment 6', groupOrder: 1 },
          { commentId: 4, content: 'test reComment 4', groupOrder: 2 },
          { commentId: 5, content: 'test reComment 5', groupOrder: 2 },
        ] as any[];

        const mockUser = {
          id: 1,
          idsOfPostsCreatedByUser: [],
          idsOfPostLikedByUser: [],
          idsOfCommentsCreatedByUser: [1, 6, 4],
          idsOfCommentLikedByUser: [2, 3, 5],
        };

        communityRepository.getComments = jest
          .fn()
          .mockResolvedValue(mockComments);
        communityRepository.getReComments = jest
          .fn()
          .mockResolvedValue(mockReComments);

        const result = await communityService.getComments(mockUser, mockPostId);

        expect(result).toEqual(expectedResult);
        expect(communityRepository.getComments).toHaveBeenCalledWith(
          mockPostId,
        );
        expect(communityRepository.getReComments).toHaveBeenCalledWith(
          mockPostId,
        );
      });
    });
    describe('- When unauthenticated', () => {
      const mockUser = false;
      // 댓글만 있고 로그인 안한 경우
      it('SUCCESS : Should return array include comments and reComments, when unauthenticated', async () => {
        const expectedResult = [
          {
            commentId: 1,
            content: 'test 1',
            groupOrder: 1,
            reComments: [],
          },
          {
            commentId: 2,
            content: 'test 2',
            groupOrder: 2,
            reComments: [],
          },
        ];

        const mockComments = [
          { commentId: 1, content: 'test 1', groupOrder: 1 },
          { commentId: 2, content: 'test 2', groupOrder: 2 },
        ] as any[];

        communityRepository.getComments = jest
          .fn()
          .mockResolvedValue(mockComments);

        const result = await communityService.getComments(mockUser, mockPostId);

        expect(result).toEqual(expectedResult);
        expect(communityRepository.getComments).toHaveBeenCalledWith(
          mockPostId,
        );
      });

      // 댓글과 대댓글이 같이 있고 로그인 안한 경우
      it('SUCCESS : Should return array include comments and reComments, when unauthenticated', async () => {
        const expectedResult = [
          {
            commentId: 1,
            content: 'test comment 1',
            groupOrder: 1,
            reComments: [
              {
                commentId: 2,
                content: 'test reComment 2',
                groupOrder: 1,
              },
              {
                commentId: 6,
                content: 'test reComment 6',
                groupOrder: 1,
              },
            ],
          },
          {
            commentId: 3,
            content: 'test comment 3',
            groupOrder: 2,

            reComments: [
              {
                commentId: 4,
                content: 'test reComment 4',
                groupOrder: 2,
              },
              {
                commentId: 5,
                content: 'test reComment 5',
                groupOrder: 2,
              },
            ],
          },
          {
            commentId: 7,
            content: 'test comment 7',
            groupOrder: 3,
            reComments: [],
          },
        ];

        const mockComments = [
          { commentId: 1, content: 'test comment 1', groupOrder: 1 },
          { commentId: 3, content: 'test comment 3', groupOrder: 2 },
          { commentId: 7, content: 'test comment 7', groupOrder: 3 },
        ] as any[];

        const mockReComments = [
          { commentId: 2, content: 'test reComment 2', groupOrder: 1 },
          { commentId: 6, content: 'test reComment 6', groupOrder: 1 },
          { commentId: 4, content: 'test reComment 4', groupOrder: 2 },
          { commentId: 5, content: 'test reComment 5', groupOrder: 2 },
        ] as any[];

        communityRepository.getComments = jest
          .fn()
          .mockResolvedValue(mockComments);
        communityRepository.getReComments = jest
          .fn()
          .mockResolvedValue(mockReComments);

        const result = await communityService.getComments(mockUser, mockPostId);

        expect(result).toEqual(expectedResult);
        expect(communityRepository.getComments).toHaveBeenCalledWith(
          mockPostId,
        );
        expect(communityRepository.getReComments).toHaveBeenCalledWith(
          mockPostId,
        );
      });
    });
  });

  describe('createComment()', () => {
    const mockUser = {
      id: 1,
    };
    // groupOrder가 존재하지 않는데 depth가 1일 때
    describe(' - When create comment (depth = 1)', () => {
      const mockCommentData: CreateCommentDto = {
        postId: 1,
        userId: mockUser.id,
        content: 'test',
        groupOrder: 1,
        depth: 1,
      };
      it('SUCCESS : Should return object of comment created by user, when groupOrder not exist', async () => {
        const existComment = [];

        communityService.getComments = jest
          .fn()
          .mockResolvedValue(existComment);

        communityRepository.createComment = jest
          .fn()
          .mockResolvedValue(mockCommentData);

        const result = await communityService.createComment(
          mockUser,
          mockCommentData,
        );
        expect(result).toEqual(mockCommentData);
        expect(communityService.getComments).toHaveBeenCalledWith(
          mockUser,
          mockCommentData.postId,
        );
        expect(communityRepository.createComment).toHaveBeenCalledWith(
          mockCommentData,
        );
      });

      // failure : groupOrder가 존재하는데 depth가 1일 때
      it('FAILURE : Should return HttpException BAD_REQUEST, if the comment with the same groupOrder already exist ', async () => {
        const existComments = [
          {
            commentId: 1,
            content: 'text',
            groupOrder: 1,
            depth: 1,
            reComment: [],
          },
        ];

        communityService.getComments = jest
          .fn()
          .mockResolvedValue(existComments);

        try {
          await communityService.createComment(mockUser, mockCommentData);
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.status).toBe(HttpStatus.BAD_REQUEST);
          expect(error.message).toBe(
            'ALREADY_EXIST_COMMENT_IN_THE_GROUP_ORDER',
          );
        }
        expect(communityService.getComments).toHaveBeenCalledWith(
          mockUser,
          mockCommentData.postId,
        );
      });
    });
    describe(' - When create reComment (depth = 2)', () => {
      const mockCommentData: CreateCommentDto = {
        postId: 1,
        userId: mockUser.id,
        content: 'test',
        groupOrder: 1,
        depth: 2,
      };
      // groupOrder가 존재하는데 depth가 2일때
      it('SUCCESS : Should return object of comment created by user, when groupOrder exist', async () => {
        const existComment = [
          { postId: 1, userId: 2, content: 'test', groupOrder: 1, depth: 1 },
        ];

        communityService.getComments = jest
          .fn()
          .mockResolvedValue(existComment);

        communityRepository.createComment = jest
          .fn()
          .mockResolvedValue(mockCommentData);

        const result = await communityService.createComment(
          mockUser,
          mockCommentData,
        );
        expect(result).toEqual(mockCommentData);
        expect(communityService.getComments).toHaveBeenCalledWith(
          mockUser,
          mockCommentData.postId,
        );
        expect(communityRepository.createComment).toHaveBeenCalledWith(
          mockCommentData,
        );
      });
      // failure : groupOrder가 존재하지 않는데 depth가 2일 때
      it('FAILURE : Should return HttpException BAD_REQUEST, if the comment with the same groupOrder not exist', async () => {
        const existComments = [
          {
            commentId: 1,
            content: 'text',
            groupOrder: 1,
            depth: 1,
            reComment: [],
          },
        ];

        communityService.getComments = jest
          .fn()
          .mockResolvedValue(existComments);

        try {
          await communityService.createComment(mockUser, mockCommentData);
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.status).toBe(HttpStatus.BAD_REQUEST);
          expect(error.message).toBe(
            'CANNOT_CREATE_RE_COMMENT_WITHOUT_COMMENT',
          );
        }
        expect(communityService.getComments).toHaveBeenCalledWith(
          mockUser,
          mockCommentData.postId,
        );
      });
    });
  });
  describe('deleteComment()', () => {
    const mockUser = {
      id: 1,
      idsOfPostsCreatedByUser: [],
      idsOfPostLikedByUser: [],
      idsOfCommentsCreatedByUser: [1] as any,
      idsOfCommentLikedByUser: [],
    };

    it('SUCCESS : Comment is deleted', async () => {
      const expectedResult = undefined;

      const mockCommentId = 1;

      const mockCriteria: DeleteCommentDto = {
        user: mockUser,
        id: mockCommentId,
      };

      const mockDeleteResult = { raw: [], affected: 1 };

      communityRepository.isCommentExist = jest.fn().mockResolvedValue(true);
      communityRepository.deleteComment = jest
        .fn()
        .mockResolvedValue(mockDeleteResult);

      const result = await communityService.deleteComment(mockCriteria);

      expect(result).toEqual(expectedResult);
      expect(communityRepository.isCommentExist).toHaveBeenCalledWith(
        mockCriteria.id,
      );
      expect(communityRepository.deleteComment).toHaveBeenCalledWith(
        mockCriteria,
      );
    });
    it('FAILURE : Should return HttpException NOT_FOUND, if commentId is not exist', async () => {
      const mockCommentId = 1;

      const mockCriteria: DeleteCommentDto = {
        user: mockUser,
        id: mockCommentId,
      };

      communityRepository.isCommentExist = jest.fn().mockResolvedValue(false);

      try {
        await communityService.deleteComment(mockCriteria);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
        expect(error.message).toBe('THE_COMMENT_IS_NOT_EXIST');
      }
      expect(communityRepository.isCommentExist).toHaveBeenCalledWith(
        mockCriteria.id,
      );
    });
    it('FAILURE : Should return HttpException FORBIDDEN, if comment is not created by user', async () => {
      const mockCommentId = 2;

      const mockCriteria: DeleteCommentDto = {
        user: mockUser,
        id: mockCommentId,
      };

      communityRepository.isCommentExist = jest.fn().mockResolvedValue(true);

      try {
        await communityService.deleteComment(mockCriteria);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.FORBIDDEN);
        expect(error.message).toBe('NOT_CREATED_BY_USER');
      }
      expect(communityRepository.isCommentExist).toHaveBeenCalledWith(
        mockCriteria.id,
      );
    });
  });

  describe('updateComment()', () => {
    const mockUser = {
      id: 1,
      idsOfPostsCreatedByUser: [],
      idsOfPostLikedByUser: [],
      idsOfCommentsCreatedByUser: [1] as any,
      idsOfCommentLikedByUser: [],
    };
    const mockContent = 'test';

    it('SUCCESS : Comment is updated', async () => {
      const expectedResult = { message: 'COMMENT_UPDATED' };

      const mockCommentId = 1;

      const mockCriteria: UpdateCommentDto = {
        user: mockUser,
        id: mockCommentId,
      };

      const mockUpdateResult = { raw: [], affected: 1 };

      communityRepository.isCommentExist = jest.fn().mockResolvedValue(true);
      communityRepository.updateComment = jest
        .fn()
        .mockResolvedValue(mockUpdateResult);

      const result = await communityService.updateComment(
        mockCriteria,
        mockContent,
      );

      expect(result).toEqual(expectedResult);
      expect(communityRepository.isCommentExist).toHaveBeenCalledWith(
        mockCriteria.id,
      );
      expect(communityRepository.updateComment).toHaveBeenCalledWith(
        mockCriteria,
        mockContent,
      );
    });

    it('FAILURE : Should return HttpException NOT_FOUND, if commentId is not exist', async () => {
      const mockCommentId = 1;

      const mockCriteria: DeleteCommentDto = {
        user: mockUser,
        id: mockCommentId,
      };

      communityRepository.isCommentExist = jest.fn().mockResolvedValue(false);

      try {
        await communityService.updateComment(mockCriteria, mockContent);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
        expect(error.message).toBe('THE_COMMENT_IS_NOT_EXIST');
      }
      expect(communityRepository.isCommentExist).toHaveBeenCalledWith(
        mockCriteria.id,
      );
    });

    it('FAILURE : Should return HttpException FORBIDDEN, if comment is not created by user', async () => {
      const mockCommentId = 2;

      const mockCriteria: DeleteCommentDto = {
        user: mockUser,
        id: mockCommentId,
      };

      communityRepository.isCommentExist = jest.fn().mockResolvedValue(true);

      try {
        await communityService.updateComment(mockCriteria, mockContent);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.FORBIDDEN);
        expect(error.message).toBe('NOT_CREATED_BY_USER');
      }
      expect(communityRepository.isCommentExist).toHaveBeenCalledWith(
        mockCriteria.id,
      );
    });
  });

  describe('createOrDeleteCommentLikes()', () => {
    const mockCriteria: CreateOrDeleteCommentLikesDto = {
      userId: 1,
      commentId: 1,
    };
    const expectedResult = CommentLike || { raw: [], affected: 1 };

    it('SUCCESS : Should return object : deleteResult or commentLike ', async () => {
      communityRepository.isCommentExist = jest.fn().mockResolvedValue(true);
      communityRepository.createOrDeleteCommentLikes = jest
        .fn()
        .mockResolvedValue(expectedResult);

      const result = await communityService.createOrDeleteCommentLikes(
        mockCriteria,
      );

      expect(result).toEqual(expectedResult);
      expect(communityRepository.isCommentExist).toHaveBeenCalledWith(
        mockCriteria.commentId,
      );
      expect(
        communityRepository.createOrDeleteCommentLikes,
      ).toHaveBeenCalledWith(mockCriteria);
    });

    it('FAILURE : Should return HttpException NOT_FOUND, if the comment is not exist', async () => {
      communityRepository.isCommentExist = jest.fn().mockResolvedValue(false);

      try {
        await communityService.createOrDeleteCommentLikes(mockCriteria);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
        expect(error.message).toBe('THE_COMMENT_IS_NOT_EXIST');
      }
      expect(communityRepository.isCommentExist).toHaveBeenCalledWith(
        mockCriteria.commentId,
      );
    });
  });

  describe('getIdsOfCommentCreatedByUser()', () => {
    it('SUCCESS : Should return the array that includes ids of comment created by user', async () => {
      const mockUserId = 1;
      const mockCommentsCreatedByUser = [
        { id: 1, postId: 1, createdAt: new Date() },
      ];
      const expectedResult = mockCommentsCreatedByUser?.map(
        (item) => Object.values(item)[0],
      );
      communityRepository.getCommentsCreatedByUser = jest
        .fn()
        .mockResolvedValue(mockCommentsCreatedByUser);

      const result = await communityService.getIdsOfCommentCreatedByUser(
        mockUserId,
      );
      expect(result).toEqual(expectedResult);
      expect(communityRepository.getCommentsCreatedByUser).toHaveBeenCalledWith(
        mockUserId,
      );
    });
  });

  describe('getIdsOfCommentLikedByUser()', () => {
    it('SUCCESS : Should return the array that includes ids of comment created by user', async () => {
      const mockUserId = 1;

      const mockLikeIdCreatedByUser = [{ comment: { id: 1 } }];

      const expectedResult = mockLikeIdCreatedByUser?.map(
        (item) => Object.values(item)[0],
      );

      communityRepository.getIdsOfCommentLikedByUser = jest
        .fn()
        .mockResolvedValue(mockLikeIdCreatedByUser);

      const result = await communityService.getIdsOfCommentLikedByUser(
        mockUserId,
      );

      expect(result).toEqual(expectedResult);
      expect(
        communityRepository.getIdsOfCommentLikedByUser,
      ).toHaveBeenCalledWith(mockUserId);
    });
  });
});
