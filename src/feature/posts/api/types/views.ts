import { LikeStatus } from '../../../../common/types';

export type NewestLikes = {
  addedAt: string;
  userId: string;
  login: string;
};

export type ExtendedLikesInfo = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
  newestLikes: NewestLikes[];
};

export type PostWithLikesInfo = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: ExtendedLikesInfo;
};

export type ViewModelWithArrayPosts = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostWithLikesInfo[];
};
