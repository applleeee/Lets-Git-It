import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCommentCommand } from './create-comment.command';
import { COMMENT_REPOSITORY } from 'src/modules/community/community.di-tokens';
import { AuthorizedUser } from 'src/modules/auth/dto/auth.dto';
import { CommentRepositoryPort } from 'src/modules/community/database/comment.repository.port';
import { Depth } from './create-comment.request.dto';
import { CommentEntity } from 'src/modules/community/domain/comment.entity';

@Injectable()
@CommandHandler(CreateCommentCommand)
export class CreateCommentCommandHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly _commentRepository: CommentRepositoryPort,
  ) {}

  async execute(command: CreateCommentCommand): Promise<any> {
    const { user, commentData } = command;

    const comments = await this.getComments(user, commentData.postId);
    const groupOrderArr = comments?.map((comment) => comment.groupOrder);

    if (
      groupOrderArr.indexOf(commentData.groupOrder) === -1 &&
      commentData.depth === Depth.RE_COMMENT
    ) {
      throw new HttpException(
        'CANNOT_CREATE_RE_COMMENT_WITHOUT_COMMENT',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      groupOrderArr.length > 0 &&
      commentData.groupOrder <= groupOrderArr[groupOrderArr?.length - 1] &&
      commentData.depth === Depth.COMMENT
    ) {
      throw new HttpException(
        'ALREADY_EXIST_COMMENT_IN_THE_GROUP_ORDER',
        HttpStatus.BAD_REQUEST,
      );
    }

    const commentEntity = CommentEntity.create(commentData);
    return await this._commentRepository.insert(commentEntity);
  }

  async getComments(user: Partial<AuthorizedUser>, postId: string) {
    const comments = await this._commentRepository.getCommentsWithPostId(
      postId,
    );

    if (comments === undefined) comments;

    if (user !== null) {
      comments.map((comment) => {
        comment.isCreatedByUser =
          user?.idsOfCommentsCreatedByUser?.indexOf(comment.commentId) >= 0
            ? true
            : false;

        comment.isLikedByUser =
          user?.idsOfCommentLikedByUser?.indexOf(comment.commentId) >= 0
            ? true
            : false;
      });
    }

    let reComments = await this._commentRepository.getReCommentsWithPostId(
      postId,
    );

    if (reComments !== undefined && user.id !== undefined) {
      reComments.map((reComment) => {
        reComment.isCreatedByUser =
          user?.idsOfCommentsCreatedByUser?.indexOf(reComment.commentId) >= 0
            ? true
            : false;

        reComment.isLikedByUser =
          user?.idsOfCommentLikedByUser?.indexOf(reComment.commentId) >= 0
            ? true
            : false;
      });
    }

    if (reComments === undefined) {
      reComments = [];
    }

    comments.map((comment) => {
      return (comment.reComments = reComments?.filter((reComment) => {
        return reComment['groupOrder'] === comment['groupOrder'];
      }));
    });

    return comments;
  }
}
