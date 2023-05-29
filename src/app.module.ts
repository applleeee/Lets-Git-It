import { validationSchema } from './config/validationSchema';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { CommunityModule } from './community/community.module';
import { RankModule } from './rank/rank.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './utils/http-exception.filter';
import { SchedulerModule } from './schedule/schedule.module';
import { GithubModule } from './github-api/github.module';
import authConfig from './config/authConfig';
import cookieConfig from './config/cookieConfig';
import ormConfig from './config/ormConfig';
import appConfig from './config/appConfig';
import { JwtRefreshStrategy } from './auth/strategy/jwt-refresh.strategy';
import { JwtStrategy } from './auth/strategy/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [authConfig, cookieConfig, appConfig, ormConfig],
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (token: ConfigType<typeof ormConfig>) =>
        token as TypeOrmModuleAsyncOptions,
      inject: [ormConfig.KEY],
    }),
    CommunityModule,
    RankModule,
    AuthModule,
    UserModule,
    SchedulerModule,
    GithubModule,
  ],
  controllers: [],
  providers: [
    JwtStrategy,
    JwtRefreshStrategy,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
