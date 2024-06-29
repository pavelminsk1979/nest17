import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikeStatus } from '../../../common/types';

export type LikeStatusForPostDocument = HydratedDocument<LikeStatusForPost>;

@Schema()
export class LikeStatusForPost {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  postId: string;

  @Prop({ required: true })
  likeStatus: LikeStatus;

  @Prop({ required: true })
  addedAt: string;

  @Prop({ required: true })
  login: string;
}

export const LikeStatusForPostShema =
  SchemaFactory.createForClass(LikeStatusForPost);
