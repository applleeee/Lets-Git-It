export class GetPostDetailQuery {
  readonly postId: string;
  constructor({ postId }) {
    this.postId = postId;
  }
}
