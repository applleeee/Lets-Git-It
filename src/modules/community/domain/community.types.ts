export interface PostProps {
  title: string;
  contentUrl: string;
  userId: string;
  subCategoryId: number;
  fixedCategoryId?: number;
}

export interface CreatePostProps extends UpdatePostProps {
  userId: string;
}

export interface UpdatePostProps {
  title: string;
  contentUrl: string;
  subCategoryId: number;
}
