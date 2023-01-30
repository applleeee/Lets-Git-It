import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityController } from './community.controller';
import { CommunityRepository } from './community.repository';
import { CommunityService } from './community.service';
import { SubCategory } from './entities/sub_category.entity';
import { MainCategory } from './entities/main_category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubCategory, MainCategory])],
  controllers: [CommunityController],
  providers: [CommunityService, CommunityRepository],
})
export class CommunityModule {}
