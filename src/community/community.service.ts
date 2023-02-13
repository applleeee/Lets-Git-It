import { Injectable } from '@nestjs/common';
import { CommunityRepository } from './community.repository';
import { CreatePostDto } from './dto/createPost.dto';
import { uploadToS3, getS3Data, deleteS3Data } from 'src/utiles/aws';
import {
  CreateCommentDto,
  CreateCommentLikesDto,
  DeleteCommentDto,
  UpdateCommentDto,
} from './dto/comment.dto';

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

  async getIdsOfPostsCreatedByUser(userId: number): Promise<number[]> {
    const data = await this.CommunityRepository.getPostsCreatedByUser(userId);
    return data.map((item) => Object.values(item)[0]);
  }

  async getIdsOfPostLikedByUser(userId: number): Promise<number[]> {
    const data = await this.CommunityRepository.getIdsOfPostLikedByUser(userId);
    return data.map((item) => Object.values(item)[0]);
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

  async deleteComment(creteria: DeleteCommentDto) {
    await this.CommunityRepository.deleteComment(creteria);
  }
  async updateComment(creteria: UpdateCommentDto, toUpdateContent: string) {
    await this.CommunityRepository.updateComment(creteria, toUpdateContent);
  }

  async readComments(postId: number) {
    return await this.CommunityRepository.readComments(postId);
  }

  async createCommentLikes(creteria: CreateCommentLikesDto) {
    await this.CommunityRepository.createCommentLikes(creteria);
  }

  async getIdsOfCommentCreatedByUser(userId: number) {
    const data = await this.CommunityRepository.getCommentsCreatedByUser(
      userId,
    );
    return data.map((item) => Object.values(item)[0]);
  }

  async getIdsOfCommentLikedByUser(userId: number): Promise<number[]> {
    const data = await this.CommunityRepository.getIdsOfCommentLikedByUser(
      userId,
    );
    return data.map((item) => Object.values(item)[0]);
  }
}
