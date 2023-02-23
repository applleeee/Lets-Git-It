import { User } from './../entities/User';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommunityRepository } from './community.repository';
import { Test } from '@nestjs/testing';
import { CommentLike } from './../entities/CommentLike';
import { Comment } from './../entities/Comment';
import { PostLike } from './../entities/PostLike';
import { Post } from './../entities/Post';
import { SubCategory } from './../entities/SubCategory';
import { Repository } from 'typeorm';

class MockRepository {
  createQueryBuilder = jest.fn().mockReturnValue({
    insert: jest.fn().mockReturnThis(),
    into: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getRawMany: jest.fn().mockReturnThis(),
    getRawOne: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    execute: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
  });
  exist = jest.fn().mockReturnThis();
  findOne = jest.fn().mockReturnThis();
  findBy = jest.fn().mockReturnThis();
  create = jest.fn();
  save = jest.fn();
  delete = jest.fn();
  insert = jest.fn();
}

describe('CommunityRepository', () => {
  let communityRepository: CommunityRepository;
  let subCategoryRepository: Repository<SubCategory>;
  let postRepository: Repository<Post>;
  let postLikeRepository: Repository<PostLike>;
  let commentRepository: Repository<Comment>;
  let commentLikeRepository: Repository<CommentLike>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CommunityRepository,
        { provide: getRepositoryToken(SubCategory), useClass: MockRepository },
        { provide: getRepositoryToken(Post), useClass: MockRepository },
        { provide: getRepositoryToken(PostLike), useClass: MockRepository },
        { provide: getRepositoryToken(Comment), useClass: MockRepository },
        { provide: getRepositoryToken(CommentLike), useClass: MockRepository },
      ],
    }).compile();

    communityRepository =
      moduleRef.get<CommunityRepository>(CommunityRepository);
    subCategoryRepository = moduleRef.get<Repository<SubCategory>>(
      getRepositoryToken(SubCategory),
    );
    postRepository = moduleRef.get<Repository<Post>>(getRepositoryToken(Post));
    postLikeRepository = moduleRef.get<Repository<PostLike>>(
      getRepositoryToken(PostLike),
    );
    commentRepository = moduleRef.get<Repository<Comment>>(
      getRepositoryToken(Comment),
    );
    commentLikeRepository = moduleRef.get<Repository<CommentLike>>(
      getRepositoryToken(CommentLike),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockUserId = 1;
  const mockComment = new Comment();

  describe('getPostsCreatedByUser()', () => {
    it('SUCCESS : Should return an array that consists of id, title, subCategory and createdAt about post created by user', async () => {
      const expectedResult = [new Post()];

      jest
        .spyOn(postRepository.createQueryBuilder(), 'getRawMany')
        .mockResolvedValue(expectedResult);

      const result = await communityRepository.getPostsCreatedByUser(
        mockUserId,
      );

      expect(result).toEqual(expectedResult);
      expect(postRepository.createQueryBuilder().where).toHaveBeenCalledWith(
        'post.user_id = :userId',
        { userId: mockUserId },
      );
    });
  });

  describe('getIdsOfPostLikedByUser()', () => {
    it('SUCCESS : Should return an array that consists of id about post liked by user ', async () => {
      const expectedResult = [new Post()];

      jest
        .spyOn(postLikeRepository.createQueryBuilder(), 'getRawMany')
        .mockResolvedValue(expectedResult);

      const result = await communityRepository.getIdsOfPostLikedByUser(
        mockUserId,
      );

      expect(result).toEqual(expectedResult);
      expect(
        postLikeRepository.createQueryBuilder().where,
      ).toHaveBeenCalledWith('user_id = :userId', { userId: mockUserId });
    });
  });

  describe('createComment()', () => {
    it('SUCCESS : Should return an object of comment created by user', async () => {
      const expectedResult = new Comment();
      const mockCreateCommentCriteria = {
        content: 'test',
        groupOrder: 1,
        depth: 1,
        userId: mockUserId,
        postId: 1,
      };

      expectedResult.content = mockCreateCommentCriteria.content;
      expectedResult.groupOrder = mockCreateCommentCriteria.groupOrder;
      expectedResult.depth = mockCreateCommentCriteria.depth;
      expectedResult.userId = mockCreateCommentCriteria.userId;
      expectedResult.postId = mockCreateCommentCriteria.postId;

      jest.spyOn(commentRepository, 'create').mockReturnValue(mockComment);
      jest.spyOn(commentRepository, 'save').mockResolvedValue(expectedResult);

      const result = await communityRepository.createComment(
        mockCreateCommentCriteria,
      );

      expect(result).toEqual(expectedResult);
      expect(commentRepository.create).toHaveBeenCalledWith(
        mockCreateCommentCriteria,
      );
      expect(commentRepository.save).toHaveBeenCalledWith(mockComment);
    });
  });

  describe('deleteComment()', () => {
    it('SUCCESS : Should return an object : DeleteResult ', async () => {
      const mockDeleteResult = { raw: [], affected: 1 };
      const mockDeleteCommentCriteria = {
        content: 'test',
        groupOrder: 1,
        depth: 1,
        userId: mockUserId,
        postId: 1,
      };

      jest
        .spyOn(commentRepository, 'delete')
        .mockResolvedValue(mockDeleteResult);

      const result = await communityRepository.deleteComment(
        mockDeleteCommentCriteria,
      );

      expect(result).toEqual(mockDeleteResult);
      expect(commentRepository.delete).toHaveBeenCalledWith(
        mockDeleteCommentCriteria,
      );
    });
  });

  describe('deleteReComment()', () => {
    it('SUCCESS : Should return an object : DeleteResult ', async () => {
      const mockDeleteResult = { raw: [], affected: 1 };
      const mockDeleteReCommentCriteria = {
        user: new User(),
        id: 1,
        content: 'test',
        groupOrder: 1,
        depth: 1,
        userId: mockUserId,
        postId: 1,
      };

      jest
        .spyOn(commentRepository, 'delete')
        .mockResolvedValue(mockDeleteResult);

      const result = await communityRepository.deleteReComment(
        mockDeleteReCommentCriteria,
      );

      expect(result).toEqual(mockDeleteResult);
      expect(commentRepository.delete).toHaveBeenCalledWith(
        mockDeleteReCommentCriteria,
      );
    });
  });

  describe('updateComment()', () => {
    it('SUCCESS : Should return object of UpdateResult', async () => {
      const mockUpdateResult = { raw: [], affected: 1 };
      const mockUpdateCommentCriteria = {
        user: new User(),
        id: 1,
      };
      const mockContent = 'test';

      jest
        .spyOn(commentRepository.createQueryBuilder(), 'execute')
        .mockResolvedValue(mockUpdateResult);

      const result = await communityRepository.updateComment(
        mockUpdateCommentCriteria,
        mockContent,
      );

      expect(result).toEqual(mockUpdateResult);
      expect(commentRepository.createQueryBuilder().where).toHaveBeenCalledWith(
        `id = ${mockUpdateCommentCriteria.id} AND user_id = ${mockUpdateCommentCriteria.user.id}`,
      );
    });
  });

  describe('isCommentExist()', () => {
    it('SUCCESS : Should return boolean : true', async () => {
      const expectedResult = true;
      const mockCommentId = 1;
      const mockCriteria = { where: { id: mockCommentId } };

      jest.spyOn(commentRepository, 'exist').mockResolvedValue(expectedResult);

      const result = await communityRepository.isCommentExist(mockCommentId);

      expect(result).toBe(expectedResult);
      expect(commentRepository.exist).toHaveBeenCalledWith(mockCriteria);
    });
  });

  describe('getComments()', () => {
    it('SUCCESS : Should return an array of comments', async () => {
      const mockPostId = 1;
      const expectedResult = [];

      jest
        .spyOn(commentRepository.createQueryBuilder(), 'getRawMany')
        .mockResolvedValue(expectedResult);

      const result = await communityRepository.getComments(mockPostId);

      expect(result).toEqual(expectedResult);
      expect(commentRepository.createQueryBuilder().where).toHaveBeenCalledWith(
        'comment.post_id = :postId AND comment.depth = 1',
        {
          postId: mockPostId,
        },
      );
    });
  });

  describe('getReComments()', () => {
    it('SUCCESS : Should return an array of comments', async () => {
      const mockPostId = 1;
      const expectedResult = [];
      jest
        .spyOn(commentRepository.createQueryBuilder(), 'getRawMany')
        .mockResolvedValue(expectedResult);

      const result = await communityRepository.getReComments(mockPostId);

      expect(result).toEqual(expectedResult);
      expect(commentRepository.createQueryBuilder().where).toHaveBeenCalledWith(
        'comment.post_id = :postId AND comment.depth = 2',
        {
          postId: mockPostId,
        },
      );
    });
  });

  describe('createOrDeleteCommentLikes()', () => {
    const mockCriteria = { userId: 1, commentId: 1 };

    describe('SUCCESS', () => {
      it('Comment likes is created :  Should return an object that consists userId, commentId, id, createdAt, updatedAt ', async () => {
        const mockFalse = false;

        const expectedResult = {
          userId: mockCriteria.userId,
          commentId: mockCriteria.commentId,
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any;

        jest.spyOn(commentLikeRepository, 'exist').mockResolvedValue(mockFalse);
        jest
          .spyOn(commentLikeRepository, 'save')
          .mockResolvedValue(expectedResult);

        const result = await communityRepository.createOrDeleteCommentLikes(
          mockCriteria,
        );

        expect(result).toEqual(expectedResult);
        expect(commentLikeRepository.exist).toHaveBeenCalledWith({
          where: { ...mockCriteria },
        });
        expect(commentLikeRepository.save).toHaveBeenCalledWith(mockCriteria);
      });

      it('Comment likes is deleted : Should return an object of DeleteResult', async () => {
        const mockTrue = true;
        const mockDeleteResult = { raw: [], affected: 1 };

        jest.spyOn(commentLikeRepository, 'exist').mockResolvedValue(mockTrue);
        jest
          .spyOn(commentLikeRepository, 'delete')
          .mockResolvedValue(mockDeleteResult);

        const result = await communityRepository.createOrDeleteCommentLikes(
          mockCriteria,
        );

        expect(result).toEqual(mockDeleteResult);
        expect(commentLikeRepository.exist).toHaveBeenCalledWith({
          where: { ...mockCriteria },
        });
      });
    });
  });

  describe('getCommentsCreatedByUser()', () => {
    it('SUCCESS : Should return an array of comment created by user', async () => {
      const expectedResult = [new Comment()];

      jest
        .spyOn(commentRepository.createQueryBuilder(), 'getRawMany')
        .mockResolvedValue(expectedResult);

      const result = await communityRepository.getCommentsCreatedByUser(
        mockUserId,
      );

      expect(result).toEqual(expectedResult);
      expect(commentRepository.createQueryBuilder().where).toHaveBeenCalledWith(
        'user_id = :userId',
        { userId: mockUserId },
      );
    });
  });

  describe('getIdsOfCommentLikedByUser()', () => {
    it('SUCCESS : Should return an array that consists of id of commentLike created by user', async () => {
      const expectedResult = [CommentLike];

      jest
        .spyOn(commentLikeRepository.createQueryBuilder(), 'getRawMany')
        .mockResolvedValue(expectedResult);

      const result = await communityRepository.getIdsOfCommentLikedByUser(
        mockUserId,
      );

      expect(result).toEqual(expectedResult);
      expect(
        commentLikeRepository.createQueryBuilder().where,
      ).toHaveBeenCalledWith('user_id = :userId', { userId: mockUserId });
    });
  });
});
