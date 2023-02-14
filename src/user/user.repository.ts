import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/User';
import { SignUpDto } from '../auth/dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateMyPageDto } from './dto/mypage.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getByGithubId(githubId: number) {
    return await this.userRepository.findOneBy({
      githubId,
    });
  }

  async getUserIdByGithubId(githubId: number) {
    const user = await this.userRepository.findOneBy({
      githubId,
    });
    return user.id;
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

  async updateMyPage(userId: number, partialEntity: UpdateMyPageDto) {
    await this.userRepository.update({ id: userId }, partialEntity);
  }
}
