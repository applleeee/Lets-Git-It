import { Comment } from './../entities/Comment';
import {
  CreateCommentBodyDto,
  UpdateCommentBodyDto,
  DeleteCommentDto,
  CreateOrDeleteCommentLikesDto,
  UpdateCommentDto,
} from './dto/comment.dto';
import { Test } from '@nestjs/testing';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { HttpException, HttpStatus } from '@nestjs/common';
import {
  CreatePostDto,
  DeleteImageDto,
  GetPostListDto,
  SortEnum,
  DateEnum,
  PostLikeDto,
  OptionEnum,
} from './dto/Post.dto';

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

  // 카테고리 리스트 조회
  describe('getAllCategories', () => {
    it('SUCCESS : should return an array of categories', async () => {
      // Arrange
      const expectedResult = [
        { id: 1, name: 'category1', mainCategoryId: 1 },
        { id: 2, name: 'category2', mainCategoryId: 2 },
      ];
      communityService.getAllCategories = jest
        .fn()
        .mockResolvedValue(expectedResult);

      // Act
      const result = await communityController.getAllCategories();

      // Assert
      expect(result).toEqual(expectedResult);
    });
  });

  // [글] 이미지 s3 업로드
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
      // Arrange
      const expectedResult =
        'https://test.com/post_image/1_2023-02-20_14-58-01';
      communityService.saveImageToS3 = jest
        .fn()
        .mockResolvedValue(expectedResult);

      // Act
      const result = await communityController.saveImageToS3(
        mockImage as any,
        mockReq,
      );

      // Assert
      expect(result).toEqual(expectedResult);
    });

    it('FAILURE : should return internal server error', async () => {
      // Arrange
      const mockError = new HttpException(
        'CANNOT_SAVE_IMAGE_TO_S3',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      communityService.saveImageToS3 = jest.fn().mockRejectedValue(mockError);

      try {
        // Act
        await communityController.saveImageToS3(mockImage as any, mockReq);
      } catch (err) {
        // Assert
        expect(err.status).toEqual(500);
        expect(err.message).toEqual('CANNOT_SAVE_IMAGE_TO_S3');
      }

      // Act & Assert
      // await expect(
      //   communityController.saveImageToS3(mockImage as any, mockReq),
      // ).rejects.toThrowError('CANNOT_SAVE_IMAGE_TO_S3');
    });
  });

  // [글] 이미지 s3 삭제
  describe('deleteImageInS3', () => {
    it('SUCCESS : should delete images in S3', async () => {
      // Arrange
      const mockData: DeleteImageDto = {
        toDeleteImage: ['image1.png', 'image2.png'],
      };
      const expectedResult = { message: 'ok' };
      communityService.deleteImageInS3 = jest
        .fn()
        .mockResolvedValue(expectedResult);

      // Act
      const result = await communityController.deleteImageInS3(mockData);

      // Assert
      expect(result).toEqual(expectedResult);
    });

    it('SUCCESS : should return message when there is no image in list', async () => {
      // Arrange
      const mockData: DeleteImageDto = { toDeleteImage: [] };
      const expectedResult = { message: 'No image to delete' };
      communityService.deleteImageInS3 = jest
        .fn()
        .mockResolvedValue(expectedResult);

      // Act
      const result = await communityController.deleteImageInS3(mockData);

      // Assert
      expect(result).toEqual(expectedResult);
    });

    it('FAILURE : should return internal server error', async () => {
      // Arrange
      const mockData = { toDeleteImage: ['image1.png', 'image2.png'] };
      const mockError = new HttpException(
        'CANNOT_DELETE_IMAGE_IN_S3',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      communityService.deleteImageInS3 = jest.fn().mockRejectedValue(mockError);

      try {
        // Act
        await communityController.deleteImageInS3(mockData);
      } catch (err) {
        // Assert
        expect(err.status).toEqual(500);
        expect(err.message).toEqual('CANNOT_DELETE_IMAGE_IN_S3');
      }
    });
  });

  // [글] 글 생성
  describe('createPost', () => {
    const mockData: CreatePostDto = {
      title: 'test1',
      subCategoryId: 1,
      content: '<p>test<p/>',
    };
    const mockReq = { user: 1 };

    it('SUCCESS : should create post and save in DB and S3 and return message', async () => {
      // Arrange
      const expectedResult = { message: 'post created' };
      communityService.createPost = jest.fn().mockResolvedValue(expectedResult);

      // Act
      const result = await communityController.createPost(mockData, mockReq);

      // Assert
      expect(result).toEqual(expectedResult);
    });

    it('FAILURE : should return internal server error', async () => {
      // Arrange
      const mockError = new HttpException(
        'CANNOT_UPLOAD_POST_TO_S3',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      communityService.createPost = jest.fn().mockRejectedValue(mockError);

      try {
        // Act
        await communityController.createPost(mockData, mockReq);
      } catch (err) {
        // Assert
        expect(err.status).toEqual(500);
        expect(err.message).toEqual('CANNOT_UPLOAD_POST_TO_S3');
      }
    });
  });

  // [글] 글 수정
  describe('updatePost', () => {
    const mockReq = { user: { idsOfPostsCreatedByUser: [1, 2], id: 1 } };
    const mockData: CreatePostDto = {
      title: 'test1',
      subCategoryId: 1,
      content: '<p>test<p/>',
    };

    it('SUCCESS : should delete old post and upload updated post in S3 and return message', async () => {
      // Arrange
      const mockPostId = 1;

      const expectedResult = { message: 'post updated' };
      communityService.updatePost = jest.fn().mockResolvedValue(expectedResult);

      // Act
      const result = await communityController.updatePost(
        mockPostId,
        mockData,
        mockReq,
      );

      // Assert
      expect(result).toEqual(expectedResult);
    });

    it('FAILURE : should return forbidden error when the user has not written that post', async () => {
      // Arrange
      const mockPostId = 3;

      try {
        // Act
        await communityController.updatePost(mockPostId, mockData, mockReq);
      } catch (err) {
        // Assert
        expect(err.status).toEqual(403);
        expect(err.message).toEqual('THIS_USER_HAS_NEVER_WRITTEN_THAT_POST');
      }
    });

    it('FAILURE : should return internal server error when fail to delete post in s3', async () => {
      // Arange
      const mockPostId = 1;
      const mockError = new HttpException(
        'CANNOT_DELETE_POST_IN_S3',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      communityService.updatePost = jest.fn().mockRejectedValue(mockError);

      try {
        // Act
        await communityController.updatePost(mockPostId, mockData, mockReq);
      } catch (err) {
        // Assert
        expect(err.status).toEqual(500);
        expect(err.message).toEqual('CANNOT_DELETE_POST_IN_S3');
      }
    });

    it('FAILURE : should return internal server error when fail to upload to s3', async () => {
      // Arange
      const mockPostId = 1;
      const mockError = new HttpException(
        'CANNOT_UPLOAD_POST_TO_S3',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      communityService.updatePost = jest.fn().mockRejectedValue(mockError);

      try {
        // Act
        await communityController.updatePost(mockPostId, mockData, mockReq);
      } catch (err) {
        // Assert
        expect(err.status).toEqual(500);
        expect(err.message).toEqual('CANNOT_UPLOAD_POST_TO_S3');
      }
    });
  });

  // [글] 글 삭제
  describe('deletePost', () => {
    const mockReq = { user: { idsOfPostsCreatedByUser: [1, 2], id: 1 } };

    it('SUCCESS : should delete post in s3 and return message', async () => {
      // Arrange
      const mockPostId = 1;

      const expectedResult = { message: 'post deleted' };
      communityService.deletePost = jest
        .fn()
        .mockResolvedValue({ affected: 1 });

      // Act
      const result = await communityController.deletePost(mockPostId, mockReq);

      // Assert
      expect(result).toEqual(expectedResult);
    });

    it('FAILURE : should return not found error when nothing was deleted in DB', async () => {
      // Arrange
      const mockPostId = 1;

      const mockError = new HttpException(
        `COULD_NOT_FIND_A_POST_WITH_ID_${mockPostId}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      communityService.deletePost = jest
        .fn()
        .mockResolvedValue({ affected: 0 });

      try {
        // Act
        await communityController.deletePost(mockPostId, mockReq);
      } catch (err) {
        // Assert
        expect(err.status).toEqual(404);
        expect(err).toEqual(mockError);
      }
    });

    it('FAILURE : should return forbidden error when the user has not written that post', async () => {
      // Arrange
      const mockPostId = 3;

      const mockError = new HttpException(
        'THIS_USER_HAS_NEVER_WRITTEN_THAT_POST',
        HttpStatus.FORBIDDEN,
      );

      try {
        // Act
        await communityController.deletePost(mockPostId, mockReq);
      } catch (err) {
        // Assert
        expect(err.status).toEqual(403);
        expect(err).toEqual(mockError);
      }
    });

    it('FAILURE : should return internal server error when fail to delete post in s3', async () => {
      // Arrange
      const mockPostId = 1;

      const mockError = new HttpException(
        'CANNOT_DELETE_POST_IN_S3',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      communityService.deletePost = jest.fn().mockRejectedValue(mockError);

      try {
        // Act
        await communityController.deletePost(mockPostId, mockReq);
      } catch (err) {
        // Assert
        expect(err.status).toEqual(500);
        expect(err).toEqual(mockError);
      }
    });
  });

  // [글] 글 목록 조회
  describe('getPostList', () => {
    it('SUCCESS : should return post list', async () => {
      // Arrange
      const mockSubCategoryId = 4;
      const mockQuery: GetPostListDto = {
        sort: SortEnum.latest,
        date: DateEnum.all,
        offset: 0,
        limit: 10,
      };
      const expectedResult = {
        fixed: [
          {
            post_title: '공지사항1',
            post_view: 0,
            postId: 7,
            createdAt: '2023-02-18',
            userId: 1,
            userName: 'apple',
            postLike: '0',
            comment: '0',
            tierName: 'bronze',
            tierId: 1,
            subCategoryName: '자유',
          },
        ],
        postLists: [
          {
            post_title: 'test1',
            post_view: 0,
            postId: 1,
            createdAt: '2023-02-21',
            userId: 1,
            userName: 'apple',
            postLike: '0',
            comment: '0',
            tierName: 'bronze',
            tierId: 1,
            subCategoryName: '자유',
          },
          {
            post_title: 'test2',
            post_view: 0,
            postId: 2,
            createdAt: '2023-02-22',
            userId: 3,
            userName: 'banana',
            postLike: '0',
            comment: '0',
            tierName: 'bronze',
            tierId: 1,
            subCategoryName: '자유',
          },
        ],
        total: 2,
      };
      communityService.getPostList = jest
        .fn()
        .mockResolvedValue(expectedResult);

      // Act
      const result = await communityController.getPostList(
        mockSubCategoryId,
        mockQuery,
      );

      // Assert
      expect(result).toEqual(expectedResult);
    });
  });

  // [글] 글 상세 페이지 조회
  describe('getPostDetail', () => {
    const mockPostId = 1;

    it('SUCCESS : should return post detail when the user logedd in, is author, and liked', async () => {
      // Arrange
      const mockReq = {
        user: {
          idsOfPostsCreatedByUser: [1, 2],
          idsOfPostLikedByUser: [1],
          id: 1,
        },
      };
      const expectedResult = {
        postId: 1,
        title: 'test1',
        content: '<p>test1</p>',
        userId: 1,
        userName: 'apple',
        subCategory: '자유',
        createdAt: '2023-02-02',
        likes: [
          {
            likeId: 1,
            userId: 1,
            createdAt: '2023-02-02',
          },
        ],
      };

      communityService.getPostDetail = jest
        .fn()
        .mockResolvedValue(expectedResult);

      expectedResult['isLogin'] = true;
      expectedResult['isAuthor'] = true;
      expectedResult['ifLiked'] = true;

      // Act
      const result = await communityController.getPostDetail(
        mockPostId,
        mockReq,
      );

      // Assert
      expect(result).toEqual(expectedResult);
    });

    it('SUCCESS : should return post detail when the user logedd in, is not author, and liked', async () => {
      // Arrange
      const mockReq = {
        user: {
          idsOfPostsCreatedByUser: [2],
          idsOfPostLikedByUser: [1],
          id: 1,
        },
      };
      const expectedResult = {
        postId: 1,
        title: 'test2',
        content: '<p>test2</p>',
        userId: 2,
        userName: 'apple',
        subCategory: '자유',
        createdAt: '2023-02-02',
        likes: [
          {
            likeId: 1,
            userId: 1,
            createdAt: '2023-02-02',
          },
        ],
      };

      communityService.getPostDetail = jest
        .fn()
        .mockResolvedValue(expectedResult);

      expectedResult['isLogin'] = true;
      expectedResult['isAuthor'] = false;
      expectedResult['ifLiked'] = true;

      // Act
      const result = await communityController.getPostDetail(
        mockPostId,
        mockReq,
      );

      // Assert
      expect(result).toEqual(expectedResult);
    });

    it('SUCCESS : should return post detail when the user logedd in, is not author, and not liked', async () => {
      // Arrange
      const mockReq = {
        user: {
          idsOfPostsCreatedByUser: [2],
          idsOfPostLikedByUser: [],
          id: 1,
        },
      };
      const expectedResult = {
        postId: 1,
        title: 'test3',
        content: '<p>test3</p>',
        userId: 2,
        userName: 'apple',
        subCategory: '자유',
        createdAt: '2023-02-02',
        likes: [
          {
            likeId: 1,
            userId: 2,
            createdAt: '2023-02-02',
          },
        ],
      };

      communityService.getPostDetail = jest
        .fn()
        .mockResolvedValue(expectedResult);

      expectedResult['isLogin'] = true;
      expectedResult['isAuthor'] = false;
      expectedResult['ifLiked'] = false;

      // Act
      const result = await communityController.getPostDetail(
        mockPostId,
        mockReq,
      );

      // Assert
      expect(result).toEqual(expectedResult);
    });

    it('SUCCESS : should return post detail when the user not logedd in', async () => {
      // Arrange
      const mockReq = {
        user: null,
      };
      const expectedResult = {
        postId: 1,
        title: 'test4',
        content: '<p>test4</p>',
        userId: 2,
        userName: 'apple',
        subCategory: '자유',
        createdAt: '2023-02-02',
        likes: [
          {
            likeId: 1,
            userId: 2,
            createdAt: '2023-02-02',
          },
        ],
      };

      communityService.getPostDetail = jest
        .fn()
        .mockResolvedValue(expectedResult);

      expectedResult['isLogin'] = false;

      // Act
      const result = await communityController.getPostDetail(
        mockPostId,
        mockReq,
      );

      // Assert
      expect(result).toEqual(expectedResult);
    });

    it('FAILURE : should return internal server error when fail to get post from s3', async () => {
      // Arrange
      const mockReq = {
        user: {
          idsOfPostsCreatedByUser: [2],
          idsOfPostLikedByUser: [],
          id: 1,
        },
      };
      const mockError = new HttpException(
        'CANNOT_GET_POST_FROM_S3',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      communityService.getPostDetail = jest.fn().mockRejectedValue(mockError);

      try {
        // Act
        await communityController.getPostDetail(mockPostId, mockReq);
      } catch (err) {
        // Assert
        expect(err.status).toEqual(500);
        expect(err).toEqual(mockError);
      }
    });
  });

  // [글] 좋아요 생성 및 삭제
  describe('createOrDeletePostLike', () => {
    it('SUCCESS : should create new like and return message', async () => {
      // Arrange
      const mockReq = {
        user: {
          idsOfPostsCreatedByUser: [2],
          idsOfPostLikedByUser: [],
          id: 1,
        },
      };
      const mockData: PostLikeDto = { postId: 1 };

      const expectedResult = { raw: null };
      communityService.createOrDeletePostLike = jest
        .fn()
        .mockResolvedValue(expectedResult);

      // Act
      const result = await communityController.createOrDeletePostLike(
        mockData,
        mockReq,
      );

      // Assert
      expect(result).toEqual({ message: 'like created' });
    });

    it('SUCCESS : should delete like and return message', async () => {
      // Arrange
      const mockReq = {
        user: {
          idsOfPostsCreatedByUser: [2],
          idsOfPostLikedByUser: [],
          id: 1,
        },
      };
      const mockData: PostLikeDto = { postId: 1 };

      const expectedResult = { raw: 1 };
      communityService.createOrDeletePostLike = jest
        .fn()
        .mockResolvedValue(expectedResult);

      // Act
      const result = await communityController.createOrDeletePostLike(
        mockData,
        mockReq,
      );

      // Assert
      expect(result).toEqual({ message: 'like deleted' });
    });
  });

  // [글] 글 검색
  describe('searchPost', () => {
    it('SUCCESS : should return search result which is list of posts', async () => {
      // Arrange
      const mockQuery = {
        option: OptionEnum.title,
        keyword: 'test',
        offset: 0,
        limit: 10,
      };
      const expectedResult = {
        searchedPosts: [
          {
            post_title: 'test',
            post_view: 0,
            postId: 8,
            createdAt: '2023-02-18',
            userId: 3,
            userName: 'testname',
            postLike: '0',
            comment: '0',
            tierName: 'bronze',
            tierId: 1,
            subCategoryName: '자유',
          },
        ],
        total: 1,
      };
      communityService.searchPost = jest.fn().mockResolvedValue(expectedResult);

      // Act
      const result = await communityController.searchPost(mockQuery);

      // Assert
      expect(result).toEqual(expectedResult);
    });
  });

  describe('createComment()', () => {
    const mockReq = {
      user: {
        id: 1,
        idsOfPostsCreatedByUser: [],
        idsOfPostLikedByUser: [],
        idsOfCommentsCreatedByUser: [],
        idsOfCommentLikedByUser: [],
      },
    };

    const mockBody: CreateCommentBodyDto = {
      content: 'test',
      groupOrder: 1,
      depth: 1,
    };

    const mockPostId = 1;

    it('SUCCESS : Should return comment object', async () => {
      const expectedResult = {
        content: 'test',
        userId: 1,
        postId: 1,
        groupOrder: 1,
        depth: 1,
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(communityService, 'createComment')
        .mockResolvedValue(expectedResult as Comment);

      const result = await communityController.createComment(
        mockBody,
        mockReq,
        mockPostId,
      );

      expect(communityService.createComment).toHaveBeenCalledWith(
        mockReq.user,
        { postId: mockPostId, userId: mockReq.user.id, ...mockBody },
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteComment()', () => {
    const mockReq = {
      user: {
        id: 1,
        idsOfPostsCreatedByUser: [],
        idsOfPostLikedByUser: [],
        idsOfCommentsCreatedByUser: [],
        idsOfCommentLikedByUser: [],
      },
    };

    const mockBody = {
      groupOrder: 1,
      postId: 1,
      depth: 1,
    };

    const mockCommentId = 1;

    const mockCriteria: DeleteCommentDto = {
      user: mockReq.user,
      id: mockCommentId,
      ...mockBody,
    };

    it('SUCCESS : Should return nothing, because status code is 204 no_content ', async () => {
      const expectedResult = undefined;
      communityService.deleteComment = jest.fn();
      const result = await communityController.deleteComment(
        mockReq,
        mockCommentId,
        mockBody,
      );

      expect(communityService.deleteComment).toBeCalledWith(mockCriteria);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateComment', () => {
    const mockReq = {
      user: {
        id: 1,
        idsOfPostsCreatedByUser: [],
        idsOfPostLikedByUser: [],
        idsOfCommentsCreatedByUser: [],
        idsOfCommentLikedByUser: [],
      },
    };

    const mockCommentId = 1;
    const mockBody: UpdateCommentBodyDto = {
      content: 'test',
    };

    const mockCriteria: UpdateCommentDto = {
      user: mockReq.user,
      id: mockCommentId,
    };

    it('SUCCESS : Should return object { message : COMMENT_UPDATED }', async () => {
      const expectedResult = { message: 'COMMENT_UPDATED' };

      communityService.updateComment = jest
        .fn()
        .mockResolvedValue(expectedResult);

      const result = await communityController.updateComment(
        mockReq,
        mockCommentId,
        mockBody,
      );

      expect(result).toEqual(expectedResult);
      expect(communityService.updateComment).toHaveBeenCalledWith(
        mockCriteria,
        mockBody.content,
      );
    });
  });

  describe('getComments()', () => {
    const mockReq = {
      user: {
        id: 1,
        idsOfPostsCreatedByUser: [],
        idsOfPostLikedByUser: [],
        idsOfCommentsCreatedByUser: [],
        idsOfCommentLikedByUser: [],
      },
    };
    const mockPostId = 1;

    it('SUCCESS : Should return comments object', async () => {
      const expectedResult = [
        {
          commentId: 1,
          content: 'text',
          reComment: { reCommentId: 1, content: 'test' },
        },
      ];

      communityService.getComments = jest
        .fn()
        .mockResolvedValue(expectedResult);

      const result = await communityController.getComments(mockReq, mockPostId);

      expect(result).toEqual(expectedResult);
      expect(communityService.getComments).toHaveBeenCalledWith(
        mockReq.user,
        mockPostId,
      );
    });
  });

  describe('createOrDeleteCommentLike()', () => {
    const mockReq = {
      user: {
        id: 1,
        idsOfPostsCreatedByUser: [],
        idsOfPostLikedByUser: [],
        idsOfCommentsCreatedByUser: [],
        idsOfCommentLikedByUser: [],
      },
    };

    const mockCommentId = 1;

    it('SUCCESS : Should return result either create or delete ', async () => {
      const expectedResult = {
        userId: 1,
        commentId: 1,
        updatedAt: new Date(),
        id: 1,
        createdAt: new Date(),
      } || {
        raw: [],
        affected: 1,
      };

      const mockCriteria: CreateOrDeleteCommentLikesDto = {
        userId: mockReq.user.id,
        commentId: mockCommentId,
      };

      communityService.createOrDeleteCommentLikes = jest
        .fn()
        .mockResolvedValue(expectedResult);

      const result = await communityController.createOrDeleteCommentLikes(
        mockReq,
        mockCommentId,
      );

      expect(result).toEqual(expectedResult);
      expect(communityService.createOrDeleteCommentLikes).toHaveBeenCalledWith(
        mockCriteria,
      );
    });
  });
});
