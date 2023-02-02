import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityModule } from './community/community.module';
import { RankModule } from './rank/rank.module';

import * as ormConfig from '../config/ormConfig';
import { Career } from './entities/Career';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(ormConfig),
    CommunityModule,
    RankModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
