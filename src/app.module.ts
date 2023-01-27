import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestModule } from './test/test.module';

import * as ormConfig from '../ormConfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(ormConfig),
    TestModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
