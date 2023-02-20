import { CommunityRepository } from './../community/community.repository';
import { Post } from './../entities/Post';
import { RankerProfile } from 'src/entities/RankerProfile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/User';
import { Field } from '../entities/Field';
import { Career } from '../entities/Career';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { RankerProfileRepository } from 'src/rank/rankerProfile.repository';
import { RankModule } from 'src/rank/rank.module';
import { SubCategory } from 'src/entities/SubCategory';
import { PostLike } from 'src/entities/PostLike';
import { Comment } from 'src/entities/Comment';
import { CommentLike } from 'src/entities/CommentLike';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Field,
      Career,
      RankerProfile,
      Post,
      SubCategory,
      PostLike,
      Comment,
      CommentLike,
    ]),
    HttpModule,
    RankModule,
  ],
  providers: [
    UserService,
    UserRepository,
    RankerProfileRepository,
    CommunityRepository,
  ],
  exports: [UserService, UserRepository],
  controllers: [UserController],
})
export class UserModule {}
