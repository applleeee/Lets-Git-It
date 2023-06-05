import { CommunityModule } from '../community/community.module';
import { RankModule } from '../rank/rank.module';
import { GithubModule } from '../github-api/github.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SignInController } from './application/commands/sign-in/sign-in.controller';
import { SignOutController } from './application/commands/sign-out/sign-out.controller';
import { SignUpController } from './application/commands/sign-up/sign-up.controller';
import { UpdateUserController } from './application/commands/update-user/update-user.controller';
import { GetUserController } from './application/queries/get-user/get-user.controller';
import { GetUserCategoryController } from './application/queries/get-user-category/get-user-category.controller';
import { UserRepository } from './database/repository/user.repository';
import { Career } from './database/entity/career.orm-entity';
import { CqrsModule } from '@nestjs/cqrs';
import { SignInCommandHandler } from './application/commands/sign-in/sign-in.handler';
import { SignUpCommandHandler } from './application/commands/sign-up/sign-up.handler';
import { UserMapper } from './mapper/user.mapper';
import { USER_CATEGORY_REPOSITORY, USER_REPOSITORY } from './user.di-tokens';
import { SignOutCommandHandler } from './application/commands/sign-out/sign-out.handler';
import { UpDateUserCommandHandler } from './application/commands/update-user/update-user.handler';
import { UserCategoryRepository } from './database/repository/user-category.repository';
import { User } from './database/entity/user.orm-entity';
import { Field } from './database/entity/field.orm-entity';
import { UserCategoryMapper } from './mapper/user-category.mapper';
import { GetUserCateGoryQueryHandler } from './application/queries/get-user-category/get-user-category.query-handler';
import { GetUserQueryHandler } from './application/queries/get-user/get-user.query-handler';

const userControllers = [
  SignInController,
  SignOutController,
  SignUpController,
  UpdateUserController,
  GetUserController,
  GetUserCategoryController,
];

const commandHandlers = [
  SignInCommandHandler,
  SignUpCommandHandler,
  SignOutCommandHandler,
  UpDateUserCommandHandler,
];

const queryHandlers = [GetUserCateGoryQueryHandler, GetUserQueryHandler];

const repositories = [
  { provide: USER_REPOSITORY, useClass: UserRepository },
  { provide: USER_CATEGORY_REPOSITORY, useClass: UserCategoryRepository },
];

const mappers = [UserMapper, UserCategoryMapper];

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Field, Career]),
    GithubModule,
    RankModule,
    CommunityModule,
    CqrsModule,
    // forwardRef(() => AuthModule),
  ],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    ...repositories,
    ...mappers,
  ],
  exports: [],
  controllers: [...userControllers],
})
export class UserModule {}
