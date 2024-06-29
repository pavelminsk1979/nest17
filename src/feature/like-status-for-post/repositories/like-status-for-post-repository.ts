import { InjectModel } from '@nestjs/mongoose';
import {
  LikeStatusForPost,
  LikeStatusForPostDocument,
} from '../domain/domain-like-status-for-post';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LikeStatusForPostRepository {
  constructor(
    @InjectModel(LikeStatusForPost.name)
    private likeStatusModelForPost: Model<LikeStatusForPostDocument>,
  ) {}

  async findDocumentByUserIdAndPostId(userId: string, postId: string) {
    /* Если документ не будет найден, 
    метод findOne() вернет null.*/

    return this.likeStatusModelForPost.findOne({ userId, postId });
  }

  async save(newLikeStatusForPost: LikeStatusForPostDocument) {
    return newLikeStatusForPost.save();
  }

  async findAllDocumentsByArrayPostId(arrayPostId: string[]) {
    /* вмассиве в котором каждый элемент это айдишкаПОСТА
     и по этим айдишкам найдет все существующие документы*/
    return this.likeStatusModelForPost
      .find({
        postId: { $in: arrayPostId },
      })
      .sort({ addedAt: -1 });

    /*.sort({ addedAt: -1 }) - это метод, который сортирует
     результаты по полю addedAt в порядке
      убывания (-1). Это означает, что более новые 
      документы будут в начале результата, а более
       старые - в конце*/
  }

  async findAllDocumentByPostId(
    postId: string,
  ): Promise<LikeStatusForPostDocument[]> {
    return this.likeStatusModelForPost.find({ postId }).sort({ addedAt: -1 });
  }
}
