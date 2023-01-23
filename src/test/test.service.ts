import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { users } from './entities/test.entity';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(users)
    private testRepository: Repository<users>,
  ) {}

  async getAllUser(): Promise<users[]> {
    const users = this.testRepository.find();
    return users;
  }

  async postUser(users: users): Promise<void> {
    await this.testRepository.save(users);
  }
}
