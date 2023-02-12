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

  async getByUserId(id: number): Promise<User> {
    return await this.userRepository.findOneBy({
      id,
    });
  }
  async createUser(signUpData: SignUpDto) {
    const user = await this.userRepository.create(signUpData);
    await this.userRepository.save(user);
  }

  async updateMyPage(userId: number, fieldId: number, careerId: number) {
    await this.userRepository.update(
      { id: userId },
      {
        fieldId: fieldId,
        careerId: careerId,
      },
    );
  }
}
