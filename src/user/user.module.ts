import { CommunityRepository } from './../community/community.repository';
import { Post } from './../entities/Post';
import { RankerProfile } from 'src/entities/RankerProfile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/User';
import { Field } from '../entities/Field';
import { Career } from '../entities/Career';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RankerProfileRepository } from 'src/rank/rankerProfile.repository';
import { RankModule } from 'src/rank/rank.module';
import { SubCategory } from 'src/entities/SubCategory';
import { PostLike } from 'src/entities/PostLike';
import { Comment } from 'src/entities/Comment';
import { CommentLike } from 'src/entities/CommentLike';
import { SignInController } from './application/commands/sign-in/sign-in.controller';
import { SignOutController } from './application/commands/sign-out/sign-out.controller';
import { SignUpController } from './application/commands/sign-up/sign-up.controller';
import { UpdateUserController } from './application/commands/update-user/update-user.controller';
import { GetUserController } from './application/queries/get-user/get-user.controller';
import { GetUserCategoryController } from './application/queries/get-user-category/get-user-category.controller';
import { UserRepository } from './database/user.repository';
import { UserService } from './application/user.service';

const userControllers = [
  SignInController,
  SignOutController,
  SignUpController,
  UpdateUserController,
  GetUserController,
  GetUserCategoryController,
];
@Module({
  imports: [TypeOrmModule.forFeature([User, Field, Career])],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
  controllers: [...userControllers],
})
export class UserModule {}
