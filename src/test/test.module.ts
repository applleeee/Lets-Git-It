import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';

@Module({
  // imports: [TypeOrmModule.forFeature([users])],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
