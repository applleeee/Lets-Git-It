import { GetPostListDto } from './get-post-list.request.dto';

export class GetPostListQuery {
  readonly subCategoryId: number;
  readonly queryParams: GetPostListDto;
  constructor({ subCategoryId, queryParams }) {
    this.subCategoryId = subCategoryId;
    this.queryParams = queryParams;
  }
}
