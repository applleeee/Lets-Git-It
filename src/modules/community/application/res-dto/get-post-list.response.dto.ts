export class GetPostListResponseDto {
  fixed: PostListDto[];
  postLists: PostListDto[];
  total: number;
}

export class PostListDto {
  post_title: string;
  post_view: number;
  postId: string;
  createdAt: Date;
  userId: string;
  userName: string;
  postLike: number;
  comment: number;
  tierName: string;
  tierId: number;
  subCategoryName: string;
}
