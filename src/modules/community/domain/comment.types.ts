export interface CommentProps {
  content: string;
  groupOrder: number;
  depth: number;
  userId: string;
  postId: string;
}

export interface CreateCommentProps extends CommentProps {}
