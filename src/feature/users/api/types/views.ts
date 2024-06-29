export type ViewUser = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

export type ViewArrayUsers = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: ViewUser[];
};