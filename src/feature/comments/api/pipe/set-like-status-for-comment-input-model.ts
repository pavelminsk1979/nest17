import { IsEnum, IsOptional } from 'class-validator';
import { LikeStatus } from '../../../../common/types';

export class SetLikeStatusForCommentInputModel {
  @IsOptional()
  @IsEnum(LikeStatus)
  likeStatus: LikeStatus;
}
