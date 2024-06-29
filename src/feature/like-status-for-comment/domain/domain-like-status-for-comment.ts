import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikeStatus } from '../../../common/types';

export type LikeStatusForCommentDocument =
  HydratedDocument<LikeStatusForComment>;

@Schema()
export class LikeStatusForComment {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  commentId: string;

  @Prop({ required: true })
  likeStatus: LikeStatus;

  @Prop({ required: true })
  addedAt: string;
}

export const LikeStatusForCommentShema =
  SchemaFactory.createForClass(LikeStatusForComment);
