import { GithubUser } from 'src/modules/github-api/github-user';

export interface GithubOauthPort {
  getGithubUser(code: string): Promise<GithubUser>;
}
