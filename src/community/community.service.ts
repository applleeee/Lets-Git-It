import { Injectable } from '@nestjs/common';
import { CommunityRepository } from './community.repository';
import { CreatePostDto } from './dto/createPost.dto';
import { uploadToS3 } from 'src/utiles/aws';

@Injectable()
export class CommunityService {
  constructor(private CommunityRepository: CommunityRepository) {}

  async getAllCategories() {
    const categories = this.CommunityRepository.getAllCategories();
    return categories;
  }

  async createPost(postData: CreatePostDto, content, userId) {
    const { title, subCategoryId } = postData;
    const contentUrl = `post/${title}`;
    const save = await this.CommunityRepository.createPost(
      title,
      userId,
      subCategoryId,
      contentUrl,
    );

    const result = await uploadToS3(content as unknown as Buffer, title);
    console.log(save, result);
  }

  async getPostList(subCategoryId: number) {
    return await this.CommunityRepository.getPostList(subCategoryId);
  }

  async createOrDeletePostLike(data, userId) {
    const { postId } = data;
    return await this.CommunityRepository.createOrDeletePostLike(
      postId,
      userId,
    );
  }
}
