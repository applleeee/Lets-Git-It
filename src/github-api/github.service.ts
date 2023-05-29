import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class GithubService {
  constructor(private readonly _http: HttpService) {}

  async getGithubAccessToken(code: string) {
    const requestBody = {
      code,
      client_id: process.env.AUTH_CLIENT_ID,
      client_secret: process.env.AUTH_CLIENT_SECRETS,
    };

    const config: AxiosRequestConfig = {
      headers: {
        accept: 'application/json',
      },
    };
    const result = await lastValueFrom<string>(
      this._http
        .post(
          `https://github.com/login/oauth/access_token`,
          requestBody,
          config,
        )
        .pipe<string>(map((res) => res.data.access_token)),
    );

    if (result === undefined) {
      throw new BadRequestException('WRONG_GITHUB_CODE');
    }
    return result;
  }

  async getGithubUserByGithubAccessToken(githubAccessToken: string) {
    const config: AxiosRequestConfig = {
      headers: {
        accept: 'application/json',
        Authorization: `token ${githubAccessToken}`,
      },
    };
    const result = await lastValueFrom(
      this._http
        .get(`https://api.github.com/user`, config)
        .pipe(map((res) => res.data)),
    );
    if (result === undefined) {
      throw new NotFoundException('NOT_FOUND_GITHUB_USER');
    }
    return result;
  }
}
