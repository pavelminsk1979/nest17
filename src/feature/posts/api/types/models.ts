/*export type CreatePostInputModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};*/

/*export type UpdatePostInputModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};*/

type SortDirection = 'asc' | 'desc';

export type QueryParamsPost = {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: SortDirection;
};
