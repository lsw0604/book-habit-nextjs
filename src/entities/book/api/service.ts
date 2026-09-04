import { API_ENDPOINTS, apiClient } from "@/shared/api";

import type { BookDetailDTO } from "./book.dto";

export interface BookService {
  fetchBookDetail: (isbn: string) => Promise<BookDetailDTO>;
}

export const bookService: BookService = {
  fetchBookDetail: async (isbn) =>
    await apiClient.get<BookDetailDTO>(API_ENDPOINTS.BOOK.DETAIL(isbn)),
};
