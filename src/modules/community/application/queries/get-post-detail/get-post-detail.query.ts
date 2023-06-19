export class GetPostDetailQuery {
  readonly postId: string | number;
  constructor({ postId }) {
    this.postId = postId;
  }
}
