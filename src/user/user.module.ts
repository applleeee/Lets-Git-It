import { AuthModule } from './../auth/auth.module';
import { CommunityModule } from './../community/community.module';
import { RankModule } from './../rank/rank.module';
import { GithubModule } from '../github-api/github.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './database/user.orm-entity';

import { Module, forwardRef } from '@nestjs/common';

import { SignInController } from './application/commands/sign-in/sign-in.controller';
import { SignOutController } from './application/commands/sign-out/sign-out.controller';
import { SignUpController } from './application/commands/sign-up/sign-up.controller';
import { UpdateUserController } from './application/commands/update-user/update-user.controller';
import { GetUserController } from './application/queries/get-user/get-user.controller';
import { GetUserCategoryController } from './application/queries/get-user-category/get-user-category.controller';
import { UserRepository } from './database/user.repository';
import { UserService } from './application/user.service';
import { Field } from './database/field.orm-entity';
import { Career } from './database/career.orm-entity';
import { CqrsModule } from '@nestjs/cqrs';
import { SignInCommandHandler } from './application/commands/sign-in/sign-in.handler';
import { SignUpCommandHandler } from './application/commands/sign-up/sign-up.handler';
import { UserMapper } from './user.mapper';

const userControllers = [
  SignInController,
  SignOutController,
  SignUpController,
  UpdateUserController,
  GetUserController,
  GetUserCategoryController,
];

const commandHandlers = [SignInCommandHandler, SignUpCommandHandler];

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Field, Career]),
    GithubModule,
    RankModule,
    CommunityModule,
    CqrsModule,
    forwardRef(() => AuthModule),
  ],
  providers: [...commandHandlers, UserService, UserRepository, UserMapper],
  exports: [UserService, UserRepository],
  controllers: [...userControllers],
})
export class UserModule {}
