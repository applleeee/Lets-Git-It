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
import {
  AUTH_SERVICE_ADAPTOR,
  GITHUB_OAUTH_ADAPTOR,
  USER_CATEGORY_REPOSITORY,
  USER_REPOSITORY,
} from './user.di-tokens';
import { SignOutCommandHandler } from './application/commands/sign-out/sign-out.handler';
import { UpdateUserCommandHandler } from './application/commands/update-user/update-user.handler';
import { UserCategoryRepository } from './database/repository/user-category.repository';
import { User } from './database/entity/user.orm-entity';
import { Field } from './database/entity/field.orm-entity';
import { UserCategoryMapper } from './mapper/user-category.mapper';
import { GetUserCateGoryQueryHandler } from './application/queries/get-user-category/get-user-category.query-handler';
import { GetUserQueryHandler } from './application/queries/get-user/get-user.query-handler';
import { RefreshController } from './application/commands/refresh/refresh.controller';
import { GithubOauthAdaptor } from './github-api/github-oauth.adaptor';
import { AuthServiceAdaptor } from './auth/auth.service.adaptor';
import { AuthModule } from '../auth/auth.module';
import { RefreshCommandHandler } from './application/commands/refresh/refresh.handler';

const userControllers = [
  SignInController,
  SignOutController,
  SignUpController,
  UpdateUserController,
  RefreshController,
  GetUserController,
  GetUserCategoryController,
];

const commandHandlers = [
  SignInCommandHandler,
  SignUpCommandHandler,
  SignOutCommandHandler,
  UpdateUserCommandHandler,
  RefreshCommandHandler,
];

const queryHandlers = [GetUserCateGoryQueryHandler, GetUserQueryHandler];

const repositories = [
  { provide: USER_REPOSITORY, useClass: UserRepository },
  { provide: USER_CATEGORY_REPOSITORY, useClass: UserCategoryRepository },
  { provide: GITHUB_OAUTH_ADAPTOR, useClass: GithubOauthAdaptor },
  { provide: AUTH_SERVICE_ADAPTOR, useClass: AuthServiceAdaptor },
];

const mappers = [UserMapper, UserCategoryMapper];

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Field, Career]),
    GithubModule,
    RankModule,
    CommunityModule,
    CqrsModule,
    AuthModule,
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
