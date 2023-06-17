import { Injectable } from '@nestjs/common';
import { GithubOauthPort } from './github-oauth.port';
import { GithubUser } from 'src/modules/github-api/github-user';
import { GithubOauthService } from 'src/modules/github-api/github-oauth.service';

@Injectable()
export class GithubOauthAdaptor implements GithubOauthPort {
  constructor(private readonly _githubOauthService: GithubOauthService) {}

  async getGithubUser(code: string): Promise<GithubUser> {
    return await this._githubOauthService.getGithubUser(code);
  }
}
