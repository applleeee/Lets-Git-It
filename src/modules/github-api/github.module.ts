import { Module } from '@nestjs/common';
import { GithubOauthService } from './github-oauth.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [GithubOauthService],
  exports: [GithubOauthService],
})
export class GithubModule {}
