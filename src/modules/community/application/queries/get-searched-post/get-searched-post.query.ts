import { SearchPostDto } from './get-searched-post.request.dto';

export class GetSearchedPostQuery {
  readonly queryParams: SearchPostDto;
  constructor({ queryParams }) {
    this.queryParams = queryParams;
  }
}
