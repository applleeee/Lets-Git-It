export class GithubUser {
  constructor(private readonly _login: string, private readonly _id: number) {}

  get login() {
    return this._login;
  }

  get id() {
    return this._id;
  }

  name: string;
  company: string | null;
  blog: string;
  location: string;
  email: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: Date;
  updated_at: Date;

  avatar_url = `https://avatars.githubusercontent.com/u/${this.id}?v=4`;
  url = `https://api.github.com/users/${this.login}`;
  html_url = `https://github.com/${this.login}`;
  followers_url = `https://api.github.com/users/${this.login}}/followers`;
  following_url = `https://api.github.com/users/${this.login}/following{/other_user}`;
  repos_url = `https://api.github.com/users/${this.login}/repos`;

  // todo 필요한 멤버변수는 위로
  // gravatar_id: string;
  // gists_url = `https://api.github.com/users/${this.login}/gists{/gist_id}`;
  // starred_url = `https://api.github.com/users/${this.login}/starred{/owner}{/repo}`;
  // subscriptions_url = `https://api.github.com/users/${this.login}/subscriptions`;
  // organizations_url = `https://api.github.com/users/${this.login}/orgs`;
  // events_url = `https://api.github.com/users/${this.login}/events{/privacy}`;
  // received_events_url = `https://api.github.com/users/${this.login}/received_events`;
  // type: 'User';
  // site_admin: false;
  // public_gists: number;
  // hireable: null;
  // twitter_username: null;
}
