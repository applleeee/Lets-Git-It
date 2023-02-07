import { SignUpDto } from './../auth/dto/auth.dto';
import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/User';
import { UserRepository } from './user.repository';
import { lastValueFrom, map } from 'rxjs';
import * as dotenv from 'dotenv';
import { HttpService } from '@nestjs/axios';
dotenv.config();

@Injectable()
export class UserService {
  constructor(
    private readonly http: HttpService,
    private readonly userRepository: UserRepository,
  ) {}
  // todo refactoring : getUser 메서드 getUserByKeyword로 통합
  async getByGithubId(githubId: number): Promise<User> {
    return await this.userRepository.getByGithubId(githubId);
  }

  async getById(id: number): Promise<User> {
    return await this.userRepository.getById(id);
  }

  async getGithubAccessToken(code: string): Promise<unknown> {
    const requestBody = {
      code,
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRETS,
    };

    return await lastValueFrom(
      this.http
        .post(`https://github.com/login/oauth/access_token`, requestBody, {
          headers: {
            accept: 'application/json',
          },
        })
        .pipe(map((res) => res.data?.access_token)),
    );
  }

  async getByGithubAccessToken(githubAccessToken: unknown) {
    return await lastValueFrom(
      this.http
        .get(`https://api.github.com/user`, {
          headers: {
            accept: 'application/json',
            Authorization: `token ${githubAccessToken}`,
          },
        })
        .pipe(map((res) => res.data)),
    );
  }

  async createUser(signUpData: SignUpDto) {
    await this.userRepository.createUser(signUpData);
  }
}
