import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import {
  LikeStatusForComment,
  LikeStatusForCommentDocument,
} from '../domain/domain-like-status-for-comment';

@Injectable()
export class LikeStatusForCommentRepository {
  constructor(
    @InjectModel(LikeStatusForComment.name)
    private likeStatusModelForComment: Model<LikeStatusForCommentDocument>,
  ) {}

  async findDocumentByUserIdAndCommentId(userId: string, commentId: string) {
    /* Если документ не будет найден, 
    метод findOne() вернет null.*/

    return this.likeStatusModelForComment.findOne({ userId, commentId });
  }

  async save(newLikeStatusForComment: LikeStatusForCommentDocument) {
    return newLikeStatusForComment.save();
  }

  async findAllDocumentsByArrayCommentId(arrayCommentId: string[]) {
    /* массив в котором каждый элемент это айдишкаКоментария
 и по этим айдишкам найдет все существующие документы*/

    return this.likeStatusModelForComment.find({
      commentId: { $in: arrayCommentId },
    });
  }

  async findAllDocumentsByCommentId(
    commentId: string,
  ): Promise<LikeStatusForCommentDocument[]> {
    return this.likeStatusModelForComment.find({ commentId });
  }
}
