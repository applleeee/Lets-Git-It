import { Comment } from './../entities/Comment';
import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { CommunityRepository } from './community.repository';
import { uploadToS3, getS3Data, deleteS3Data } from '../utils/aws';
import {
  CreateCommentDto,
  CreateOrDeleteCommentLikesDto,
  DeleteCommentDto,
  UpdateCommentDto,
  Depth,
} from './dto/comment.dto';
import { Post } from '../entities/Post';
import {
  GetPostListDto,
  CreatePostDto,
  SearchPostDto,
  DeleteImageDto,
  PostLikeDto,
} from './dto/Post.dto';
@Injectable()
export class CommunityService {
  constructor(private CommunityRepository: CommunityRepository) {}

  private getCurrentTime() {
    return new Date(+new Date() + 3240 * 10000)
      .toISOString()
      .replace('T', '_')
      .replace(/\..*/, '')
      .replace(/\:/g, '-');
  }

  async getAllCategories() {
    return this.CommunityRepository.getAllCategories();
  }

  async saveImageToS3(image, userId: number) {
    const now = this.getCurrentTime();

    const name = `post_images/${userId}_${now}`;
    const mimetype = image.mimetype;
    try {
      const saveToS3 = await uploadToS3(image.buffer, name, mimetype);
      return saveToS3.Location;
    } catch (err) {
      throw new HttpException(
        'CANNOT_SAVE_IMAGE_TO_S3',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteImageInS3(toDeleteImageData: DeleteImageDto) {
    const { toDeleteImage } = toDeleteImageData;
    if (toDeleteImage.length !== 0) {
      try {
        return await deleteS3Data(toDeleteImage);
      } catch (err) {
        throw new HttpException(
          'CANNOT_DELETE_IMAGE_IN_S3',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    return { message: 'No image to delete' };
  }

  async createPost(postData: CreatePostDto, userId: number) {
    const now = this.getCurrentTime();

    const { title, subCategoryId, content } = postData;
    const contentUrl = `post/${userId}_${title}_${now}`;
    const mimetype = 'string';
    try {
      await uploadToS3(content as unknown as Buffer, contentUrl, mimetype);
    } catch (err) {
      throw new HttpException(
        'CANNOT_UPLOAD_POST_TO_S3',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    await this.CommunityRepository.createPost(
      title,
      userId,
      subCategoryId,
      contentUrl,
    );
  }

  async getPostToUpdate(postId: number) {
    const postDetail = await this.CommunityRepository.getPostById(postId);
    try {
      const postContent = await getS3Data(postDetail.contentUrl);
      postDetail['content'] = postContent;
      delete postDetail.contentUrl;
      return postDetail;
    } catch (err) {
      throw new HttpException(
        'CANNOT_GET_POST_FROM_S3',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updatePost(postId: number, updatedData: CreatePostDto, userId: number) {
    const originPost = await this.CommunityRepository.getPostById(postId);
    try {
      await deleteS3Data([originPost.contentUrl]);
    } catch (err) {
      throw new HttpException(
        'CANNOT_DELETE_POST_IN_S3',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const now = this.getCurrentTime();
    const { title, subCategoryId, content } = updatedData;

    const contentUrl = `post/${userId}_${title}_${now}`;
    const mimetype = 'string';
    try {
      await uploadToS3(content as unknown as Buffer, contentUrl, mimetype);
    } catch (err) {
      throw new HttpException(
        'CANNOT_UPLOAD_POST_TO_S3',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await this.CommunityRepository.updatePost(
      postId,
      title,
      subCategoryId,
      contentUrl,
    );
  }

  async deletePost(postId: number) {
    const originPost = await this.CommunityRepository.getPostById(postId);
    try {
      await deleteS3Data([originPost.contentUrl]);
    } catch (err) {
      throw new HttpException(
        'CANNOT_DELETE_POST_IN_S3',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return await this.CommunityRepository.deletePost(postId);
  }

  async getPostList(subCategoryId: number, query: GetPostListDto) {
    const { sort, date, offset, limit } = query;
    return await this.CommunityRepository.getPostList(
      subCategoryId,
      sort,
      date,
      offset,
      limit,
    );
  }

  async getPostDetail(postId: number) {
    const postDetail = await this.CommunityRepository.getPostDatail(postId);

    try {
      const postContent = await getS3Data(postDetail.content);
      postDetail.content = postContent;
      return postDetail;
    } catch (err) {
      throw new HttpException(
        'CANNOT_GET_POST_FROM_S3',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createOrDeletePostLike(data: PostLikeDto, userId: number) {
    const { postId } = data;
    return await this.CommunityRepository.createOrDeletePostLike(
      postId,
      userId,
    );
  }

  async searchPost(query: SearchPostDto) {
    const { option, keyword, offset, limit } = query;
    const result = await this.CommunityRepository.searchPost(
      option,
      keyword,
      offset,
      limit,
    );
    return result;
  }

  async getIdsOfPostsCreatedByUser(userId: number) {
    const data = await this.CommunityRepository.getPostsCreatedByUser(userId);
    return data?.map<Post>((item) => Object.values(item)[0]);
  }

  async getIdsOfPostLikedByUser(userId: number) {
    const data = await this.CommunityRepository.getIdsOfPostLikedByUser(userId);
    return data?.map<Post['id']>((item) => Object.values(item)[0]);
  }

  async createComment(user, commentData: CreateCommentDto) {
    const comments = await this.getComments(user, commentData.postId);
    const groupOrderArr = comments?.map((comment) => comment.groupOrder);

    if (
      groupOrderArr.indexOf(commentData.groupOrder) === -1 &&
      commentData.depth === Depth.RE_COMMENT
    )
      throw new HttpException(
        'CANNOT_CREATE_RE_COMMENT_WITHOUT_COMMENT',
        HttpStatus.BAD_REQUEST,
      );

    if (
      groupOrderArr.length > 0 &&
      commentData.groupOrder <= groupOrderArr[groupOrderArr?.length - 1] &&
      commentData.depth === Depth.COMMENT
    )
      throw new HttpException(
        'ALREADY_EXIST_COMMENT_IN_THE_GROUP_ORDER',
        HttpStatus.BAD_REQUEST,
      );

    return await this.CommunityRepository.createComment(commentData);
  }

  async deleteComment(criteria: DeleteCommentDto) {
    const isCommentExist = await this.CommunityRepository.isCommentExist(
      criteria.id,
    );

    if (!isCommentExist)
      throw new HttpException('THE_COMMENT_IS_NOT_EXIST', HttpStatus.NOT_FOUND);

    const commentIdsCreatedByUser = criteria.user
      .idsOfCommentsCreatedByUser as unknown[];

    if (commentIdsCreatedByUser?.indexOf(criteria.id) === -1)
      throw new HttpException('NOT_CREATED_BY_USER', HttpStatus.FORBIDDEN);

    // 대댓글인 경우 해당 댓글만 삭제
    if (criteria.depth === 2) {
      await this.CommunityRepository.deleteReComment(criteria);
    }

    // 댓글인 경우 해당 groupOrder에 있는 depth 2인 댓글 전체 삭제
    if (criteria.depth === 1)
      await this.CommunityRepository.deleteComment({
        groupOrder: criteria.groupOrder,
        postId: criteria.postId,
      });
  }

  async updateComment(criteria: UpdateCommentDto, content: string) {
    const commentIdsCreatedByUser = criteria.user
      .idsOfCommentsCreatedByUser as unknown[];

    const isCommentExist = await this.CommunityRepository.isCommentExist(
      criteria.id,
    );

    if (!isCommentExist)
      throw new HttpException('THE_COMMENT_IS_NOT_EXIST', HttpStatus.NOT_FOUND);

    if (commentIdsCreatedByUser?.indexOf(criteria.id) === -1)
      throw new HttpException('NOT_CREATED_BY_USER', HttpStatus.FORBIDDEN);

    await this.CommunityRepository.updateComment(criteria, content);

    return { message: 'COMMENT_UPDATED' };
  }

  async getComments(user, postId: number) {
    const comments = await this.CommunityRepository.getComments(postId);

    if (comments === undefined) comments;

    if (user !== false)
      comments.map((comment) => {
        comment.isCreatedByUser =
          user?.idsOfCommentsCreatedByUser?.indexOf(comment.commentId) >= 0
            ? true
            : false;
        comment.isLikedByUser =
          user?.idsOfCommentLikedByUser?.indexOf(comment.commentId) >= 0
            ? true
            : false;
      });

    let reComments = await this.CommunityRepository.getReComments(postId);

    if (reComments !== undefined && user.id !== undefined) {
      reComments.map((reComment) => {
        reComment.isCreatedByUser =
          user?.idsOfCommentsCreatedByUser?.indexOf(reComment.commentId) >= 0
            ? true
            : false;
        reComment.isLikedByUser =
          user?.idsOfCommentLikedByUser?.indexOf(reComment.commentId) >= 0
            ? true
            : false;
      });
    }

    if (reComments === undefined) {
      reComments = [];
    }

    comments.map((comment) => {
      return (comment.reComments = reComments?.filter((reComment) => {
        return reComment['groupOrder'] === comment['groupOrder'];
      }));
    });

    return comments;
  }

  async createOrDeleteCommentLikes(criteria: CreateOrDeleteCommentLikesDto) {
    const isCommentExist = await this.CommunityRepository.isCommentExist(
      criteria.commentId,
    );

    if (!isCommentExist)
      throw new HttpException('THE_COMMENT_IS_NOT_EXIST', HttpStatus.NOT_FOUND);

    return await this.CommunityRepository.createOrDeleteCommentLikes(criteria);
  }

  async getIdsOfCommentCreatedByUser(userId: number) {
    const data = await this.CommunityRepository.getCommentsCreatedByUser(
      userId,
    );
    return data?.map<Comment>((item) => Object.values(item)[0]);
  }

  async getIdsOfCommentLikedByUser(userId: number) {
    const data = await this.CommunityRepository.getIdsOfCommentLikedByUser(
      userId,
    );
    return data?.map<Comment['id']>((item) => Object.values(item)[0]);
  }
}
