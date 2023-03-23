import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityModule } from './community/community.module';
import { RankModule } from './rank/rank.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

import * as ormConfig from '../config/ormConfig';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './utils/http-exception.filter';
import { SchedulerModule } from './schedule/schedule.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 20,
    }),
    TypeOrmModule.forRoot(ormConfig),
    CommunityModule,
    RankModule,
    AuthModule,
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
