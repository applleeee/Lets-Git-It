import { Injectable } from '@nestjs/common';
import { CommunityRepository } from './community.repository';

@Injectable()
export class CommunityService {
  constructor(private CommunityRepository: CommunityRepository) {}

  async getAllCategories() {
    const categories = this.CommunityRepository.getAllCategories();
    return categories;
  }
}
