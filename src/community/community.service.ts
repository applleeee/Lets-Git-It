import { Injectable } from '@nestjs/common';
import { CommunityRepository } from './community.repository';
import { CreatePostDto } from './dto/createPost.dto';
import { uploadToS3, getS3Data } from 'src/utiles/aws';
import {
  CreateCommentDto,
  CreateCommentLikesDto,
  DeleteCommentDto,
  UpdateCommentDto,
} from './dto/comment.dto';

@Injectable()
export class CommunityService {
  constructor(private CommunityRepository: CommunityRepository) {}

  async getAllCategories() {
    const categories = this.CommunityRepository.getAllCategories();
    return categories;
  }

  async saveImageToS3(image, userId: number) {
    const now = new Date(+new Date() + 3240 * 10000)
      .toISOString()
      .replace('T', '_')
      .replace(/\..*/, '')
      .replace(/\:/g, '-');

    const name = `post_images/${userId}_${now}`;
    const mimetype = image.mimetype;
    const saveToS3 = await uploadToS3(image.buffer, name, mimetype);
    return saveToS3.Location;
  }

  async createPost(postData: CreatePostDto, userId: number) {
    const now = new Date(+new Date() + 3240 * 10000)
      .toISOString()
      .replace('T', '_')
      .replace(/\..*/, '')
      .replace(/\:/g, '-');

    const { title, subCategoryId, content } = postData;
    const contentUrl = `post/${userId}_${title}_${now}`;
    await this.CommunityRepository.createPost(
      title,
      userId,
      subCategoryId,
      contentUrl,
    );
    const mimetype = 'string';
    const result = await uploadToS3(
      content as unknown as Buffer,
      contentUrl,
      mimetype,
    );
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
