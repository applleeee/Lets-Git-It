export class GetPostDetailResponseDto {
  postTitle: string;
  postId: string;
  userId: string;
  content: string;
  userName: string;
  userProfileImage: string;
  tierId: number;
  tierName: string;
  subCategoryId: number;
  subCategoryName: string;
  createdAt: Date;
  likes: null | LikesInPostDetailType;
  isLogin: boolean;
  isAuthor: boolean;
  ifLiked: boolean;
}

export class LikesInPostDetailType {
  likeId: number;
  userId: string;
  createdAt: Date;
}
