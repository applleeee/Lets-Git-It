export interface PostProps {
  title: string;
  contentUrl: string;
  userId: string;
  subCategoryId: number;
  fixedCategoryId?: number;
}

export interface CreatePostProps {
  title: string;
  contentUrl: string;
  userId: string;
  subCategoryId: number;
}
