import { Controller, Get, Post } from '@nestjs/common';
import { TestService } from './test.service';

@Controller('/ping')
export class TestController {
  constructor(private testService: TestService) {}

  @Get()
  ping() {
    return { data: 'pong' };
  }

  @Get('/users')
  async getUser() {
    const user = await this.testService.getAllUser();
    return user;
  }

  @Post('/user')
  async postUser() {
    await this.testService.postUser({ id: 1, name: 'abc' });
    return 'user created';
  }
}
