import { Controller, Get } from '@nestjs/common';
import { CommunityService } from './community.service';

@Controller('/community')
export class CommunityController {
  constructor(private communityService: CommunityService) {}

  @Get('/categories')
  async getAllCategories() {
    const categories = await this.communityService.getAllCategories();
    return categories;
  }
}
