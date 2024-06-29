export type ViewBlog = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

export type ViewArrayBlog = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: ViewBlog[];
};
