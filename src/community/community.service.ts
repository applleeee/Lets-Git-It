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

  async createPost(postData: CreatePostDto, content) {
    const { title, userId, subCategoryId } = postData;
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
}
