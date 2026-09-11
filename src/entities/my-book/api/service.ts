import { API_ENDPOINTS, apiClient } from "@/shared/api";
import type { ResponsePagination } from "@/shared/api";

import type {
  MyBookDetailDTO,
  MyBookListItemDTO,
  MyBookListParamsDTO,
} from "./my-book.dto";

export interface MyBookService {
  fetchMyBooks: (
    params: MyBookListParamsDTO,
  ) => Promise<ResponsePagination<MyBookListItemDTO>>;
  fetchMyBookDetail: (id: number) => Promise<MyBookDetailDTO>;
  fetchMyBookByIsbn: (isbn: string) => Promise<MyBookDetailDTO | null>;
}

export const myBookService: MyBookService = {
  fetchMyBooks: async (params) =>
    await apiClient.get<ResponsePagination<MyBookListItemDTO>>(
      API_ENDPOINTS.MY_BOOK.ROOT,
      { params },
    ),
  fetchMyBookDetail: async (id) =>
    await apiClient.get<MyBookDetailDTO>(API_ENDPOINTS.MY_BOOK.BY_ID(id)),
  fetchMyBookByIsbn: async (isbn) =>
    await apiClient.get<MyBookDetailDTO | null>(
      API_ENDPOINTS.MY_BOOK.BY_ISBN(isbn),
    ),
};
