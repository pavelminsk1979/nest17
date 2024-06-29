import { IsEnum, IsOptional } from 'class-validator';
import { LikeStatus } from '../../../../common/types';

export class SetLikeStatusForPostInputModel {
  @IsOptional()
  @IsEnum(LikeStatus)
  likeStatus: LikeStatus;
}
