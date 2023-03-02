import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityModule } from './community/community.module';
import { RankModule } from './rank/rank.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

import * as ormConfig from '../config/ormConfig';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './utiles/http-exception.filter';
import { SchedulerModule } from './schedule/schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
      // 의존성 주입이 가능하도록 module에도 설정해준다.
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
