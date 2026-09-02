import { API_ENDPOINTS, apiClient } from "@/shared/api";
import type { ResponsePagination } from "@/shared/api";
import type { BookSummaryDTO } from "@/entities/book";

import type { SearchBookParams } from "../model";

export interface SearchBookService {
  search: (
    params: SearchBookParams & { page?: number },
  ) => Promise<ResponsePagination<BookSummaryDTO>>;
}

export const searchBookService: SearchBookService = {
  search: async (params) =>
    await apiClient.get(API_ENDPOINTS.BOOK.SEARCH, { params }),
};
