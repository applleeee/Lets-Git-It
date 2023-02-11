import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/User';
import { SignUpDto } from '../auth/dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getByGithubId(githubId: number): Promise<User> {
    return await this.userRepository.findOneBy({
      githubId,
    });
  }

  async getById(id: number): Promise<User> {
    return await this.userRepository.findOneBy({
      id,
    });
  }
  async createUser(signUpData: SignUpDto) {
    const user = await this.userRepository.create(signUpData);
    await this.userRepository.save(user);
  }
}
