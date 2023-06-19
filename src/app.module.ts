import { validationSchema } from './config/validationSchema';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { RankModule } from './modules/rank/rank.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './utils/http-exception.filter';
import authConfig from './config/authConfig';
import cookieConfig from './config/cookieConfig';
import appConfig from './config/appConfig';
import ormConfig from './config/ormConfig';
import { CommunityModule } from './modules/community/community.module';
import { UserModule } from './modules/user/user.module';
import { SchedulerModule } from './modules/schedule/schedule.module';

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
    UserModule,
    SchedulerModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
