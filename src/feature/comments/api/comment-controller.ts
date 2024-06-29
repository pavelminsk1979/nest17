import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentQueryRepository } from '../reposetories/comment-query-repository';
import { AuthTokenGuard } from '../../../common/guard/auth-token-guard';
import { UpdateCorrectCommentInputModel } from './pipe/update-correct-comment';
import { CommentService } from '../services/comment-service';
import { Request } from 'express';
import { SetLikeStatusForCommentInputModel } from './pipe/set-like-status-for-comment-input-model';
import { LikeStatusForCommentDocument } from '../../like-status-for-comment/domain/domain-like-status-for-comment';
import { DataUserExtractorFromTokenGuard } from '../../../common/guard/data-user-extractor-from-token-guard';

@Controller('comments')
export class CommentController {
  constructor(
    protected commentQueryRepository: CommentQueryRepository,
    protected commentService: CommentService,
  ) {}

  @UseGuards(DataUserExtractorFromTokenGuard)
  @Get(':id')
  async getCommentById(
    @Param('id') commentId: string,
    @Req() request: Request,
  ) {
    /*Айдишка пользователя нужна для-- когда
отдадим ответ в нем будет информация
о том какой статус учтановил данный пользователь
который этот запрос делает */

    const userId: string | null = request['userId'];

    //вернуть один  коментарий по айдишке
    //и у него будут данные о лайках

    const comment = await this.commentQueryRepository.getCommentById(
      userId,
      commentId,
    );

    if (comment) {
      return comment;
    } else {
      throw new NotFoundException(
        'comment not found:method-get,url /comments/id',
      );
    }
  }

  @UseGuards(AuthTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':commentId')
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() updateCommentInputModel: UpdateCorrectCommentInputModel,
    @Req() request: Request,
  ) {
    // когда AccessToken проверяю в AuthTokenGuard - тогда
    // из него достаю userId и помещаю ее в request

    const userId = request['userId'];

    const isUpdateComment = await this.commentService.updateComment(
      userId,
      commentId,
      updateCommentInputModel.content,
    );

    if (isUpdateComment) {
      return;
    } else {
      throw new NotFoundException(
        'comment not update:method-put ,url /commetns/commentId',
      );
    }
  }

  @UseGuards(AuthTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':commentId')
  async deleteCommentById(
    @Param('commentId') commentId: string,
    @Req() request: Request,
  ) {
    const userId = request['userId'];

    const isDeleteCommentById = await this.commentService.deleteCommentById(
      userId,
      commentId,
    );

    if (isDeleteCommentById) {
      return;
    } else {
      /*соответствует HTTP статус коду 404*/
      throw new NotFoundException(
        'comment  not found:method-delete,url-comment/commentId',
      );
    }
  }

  @UseGuards(AuthTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':commentId/like-status')
  async setLikeStatusForComment(
    @Param('commentId') commentId: string,
    @Body() likeStatusForCommentInputModel: SetLikeStatusForCommentInputModel,
    @Req() request: Request,
  ) {
    /* ---лайкСтатус будет конкретного user
     и для конкретного КОМЕНТАРИЯ
     -----лайкСтатус  будет создан новый документ
     или изменен уже существующий документ*/

    const userId = request['userId'];

    const isSetLikestatusForComment: LikeStatusForCommentDocument | null =
      await this.commentService.setLikestatusForComment(
        userId,
        commentId,
        likeStatusForCommentInputModel.likeStatus,
      );

    if (isSetLikestatusForComment) {
      return;
    } else {
      throw new NotFoundException(
        'comment not exist :method-put ,url /commens/commentId/like-status',
      );
    }
  }
}
