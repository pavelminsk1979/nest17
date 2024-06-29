import { Injectable } from '@nestjs/common';
import { Comment, CommentDocument } from '../domaims/domain-comment';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
/*@Injectable()-декоратор что данный клас инжектируемый
 * ОБЯЗАТЕЛЬНО ДОБАВЛЯТЬ  В ФАЙЛ app.module
 * providers: [AppService,UsersService,UsersRepository]*/
export class CommentRepository {
  constructor(
    /* вот тут моделька инжектится
      именно декоратор  @InjectModel
       */
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async save(newComment: CommentDocument) {
    return newComment.save();
  }

  async findCommentById(commentId: string) {
    return this.commentModel.findById(commentId);
  }

  async deleteCommentById(commentId: string) {
    const result = await this.commentModel.findByIdAndDelete(commentId);

    /*  findByIdAndDelete() возвращает сам удаленный документ*/
    return !!result;
  }
}
