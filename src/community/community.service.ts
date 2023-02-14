import { Comment } from './../entities/Comment';
import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { CommunityRepository } from './community.repository';
import { CreatePostDto } from './dto/createPost.dto';
import { uploadToS3, getS3Data, deleteS3Data } from 'src/utiles/aws';
import {
  CreateCommentDto,
  CreateCommentLikesDto,
  DeleteCommentDto,
  UpdateCommentDto,
} from './dto/comment.dto';
import { Post } from 'src/entities/Post';

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
    const categories = this.CommunityRepository.getAllCategories();
    return categories;
  }

  async saveImageToS3(image, userId: number) {
    // const now = new Date(+new Date() + 3240 * 10000)
    //   .toISOString()
    //   .replace('T', '_')
    //   .replace(/\..*/, '')
    //   .replace(/\:/g, '-');
    const now = this.getCurrentTime();

    const name = `post_images/${userId}_${now}`;
    const mimetype = image.mimetype;
    const saveToS3 = await uploadToS3(image.buffer, name, mimetype);
    return saveToS3.Location;
  }

  async createPost(postData: CreatePostDto, userId: number) {
    // const now = new Date(+new Date() + 3240 * 10000)
    //   .toISOString()
    //   .replace('T', '_')
    //   .replace(/\..*/, '')
    //   .replace(/\:/g, '-');
    const now = this.getCurrentTime();

    const { title, subCategoryId, content } = postData;
    const contentUrl = `post/${userId}_${title}_${now}`;
    const mimetype = 'string';
    try {
      await uploadToS3(content as unknown as Buffer, contentUrl, mimetype);
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }

    await this.CommunityRepository.createPost(
      title,
      userId,
      subCategoryId,
      contentUrl,
    );
  }

  async getPostToUpdate(postId: number) {
    const postDetail = await this.CommunityRepository.getPostToUpdate(postId);
    const postContent = await getS3Data(postDetail.contentUrl);
    postDetail['content'] = postContent;
    delete postDetail.contentUrl;
    return postDetail;
  }

  async updatePost(postId: number, updatedData: CreatePostDto, userId: number) {
    const originPost = await this.CommunityRepository.getPostToUpdate(postId);
    try {
      await deleteS3Data(originPost.contentUrl);
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }

    const now = this.getCurrentTime();

    const { title, subCategoryId, content } = updatedData;
    const contentUrl = `post/${userId}_${title}_${now}`;
    const mimetype = 'string';
    try {
      await uploadToS3(content as unknown as Buffer, contentUrl, mimetype);
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }

    await this.CommunityRepository.updatePost(
      postId,
      title,
      subCategoryId,
      contentUrl,
    );
  }

  async deletePost(postId: number, userId: number) {
    return await this.CommunityRepository.deletePost(postId, userId);
  }

  async getPostList(subCategoryId: number) {
    return await this.CommunityRepository.getPostList(subCategoryId);
  }

  async getPostDetail(postId: number) {
    const postDetail = await this.CommunityRepository.getPostDatail(postId);
    const postContent = await getS3Data(postDetail.content);
    postDetail.content = postContent;

    return postDetail;
  }

  async getIdsOfPostsCreatedByUser(userId: number) {
    const data = await this.CommunityRepository.getPostsCreatedByUser(userId);
    return data.map<Post>((item) => Object.values(item)[0]);
  }

  async getIdsOfPostLikedByUser(userId: number) {
    const data = await this.CommunityRepository.getIdsOfPostLikedByUser(userId);
    return data.map<Post['id']>((item) => Object.values(item)[0]);
  }

  async createOrDeletePostLike(data, userId) {
    const { postId } = data;
    return await this.CommunityRepository.createOrDeletePostLike(
      postId,
      userId,
    );
  }

  async createComment(commentData: CreateCommentDto) {
    await this.CommunityRepository.createComment(commentData);
  }

  async deleteComment(criteria: DeleteCommentDto) {
    return await this.CommunityRepository.deleteComment(criteria);
  }
  async updateComment(criteria: UpdateCommentDto, toUpdateContent: string) {
    const isCommentExist = await this.CommunityRepository.isCommentExist(
      criteria.id,
    );

    if (!isCommentExist)
      throw new HttpException(
        'THE_COMMENT_IS_NOT_EXIST',
        HttpStatus.BAD_REQUEST,
      );

    return await this.CommunityRepository.updateComment(
      criteria,
      toUpdateContent,
    );
  }

  async readComments(userId: number, postId: number) {
    const comments = await this.CommunityRepository.readComments(postId);
    const reComments = await this.CommunityRepository.readReComments(postId);

    comments.map((item) => {
      item.isCreatedByUser = item.userId === userId ? true : false;
    });
    reComments.map((item) => {
      item.isCreatedByUser = item.userId === userId ? true : false;
    });

    comments.map((comment) => {
      return (comment.reComments = reComments.filter((reComment) => {
        return reComment['groupOrder'] === comment['groupOrder'];
      }));
    });
    return comments;
  }

  async createCommentLikes(criteria: CreateCommentLikesDto) {
    return await this.CommunityRepository.createCommentLikes(criteria);
  }

  async getIdsOfCommentCreatedByUser(userId: number) {
    const data = await this.CommunityRepository.getCommentsCreatedByUser(
      userId,
    );
    return data.map<Comment>((item) => Object.values(item)[0]);
  }

  async getIdsOfCommentLikedByUser(userId: number) {
    const data = await this.CommunityRepository.getIdsOfCommentLikedByUser(
      userId,
    );
    return data.map<Comment['id']>((item) => Object.values(item)[0]);
  }
}
