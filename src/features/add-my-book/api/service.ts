import { MyBookDetailDTO } from "@/entities/my-book";
import { API_ENDPOINTS, apiClient } from "@/shared/api";

import { RequestAddMyBookDTO } from "./add-my-book.dto";

export interface AddMyBookService {
  addMyBook: (payload: RequestAddMyBookDTO) => Promise<MyBookDetailDTO>;
}

export const addMyBookService: AddMyBookService = {
  addMyBook: async (payload) => {
    const response = await apiClient.post<MyBookDetailDTO>(
      API_ENDPOINTS.MY_BOOK.ROOT,
      payload,
    );
    return response;
  },
};
