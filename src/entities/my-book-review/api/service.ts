import { API_ENDPOINTS, apiClient } from "@/shared/api";
import type { ResponsePagination } from "@/shared/api";

import type {
  MyBookReviewDetailDTO,
  MyBookReviewListItemDTO,
  MyBookReviewListParamsDTO,
} from "./my-book-review.dto";

export interface MyBookReviewService {
  fetchMyBookReviews: (
    params: MyBookReviewListParamsDTO,
  ) => Promise<ResponsePagination<MyBookReviewListItemDTO>>;
  fetchLikedMyBookReviews: (
    params: MyBookReviewListParamsDTO,
  ) => Promise<ResponsePagination<MyBookReviewListItemDTO>>;
  fetchCommentedMyBookReviews: (
    params: MyBookReviewListParamsDTO,
  ) => Promise<ResponsePagination<MyBookReviewListItemDTO>>;
  /** `myBookId`로 조회한다 — 한줄평 자신의 PK가 아니다(`MY_BOOK_REVIEW.BY_MY_BOOK_ID` 참고). */
  fetchMyBookReviewDetail: (myBookId: number) => Promise<MyBookReviewDetailDTO>;
}

export const myBookReviewService: MyBookReviewService = {
  fetchMyBookReviews: async (params) =>
    await apiClient.get<ResponsePagination<MyBookReviewListItemDTO>>(
      API_ENDPOINTS.MY_BOOK_REVIEW.ROOT,
      { params },
    ),
  fetchLikedMyBookReviews: async (params) =>
    await apiClient.get<ResponsePagination<MyBookReviewListItemDTO>>(
      API_ENDPOINTS.MY_BOOK_REVIEW.LIKED,
      { params },
    ),
  fetchCommentedMyBookReviews: async (params) =>
    await apiClient.get<ResponsePagination<MyBookReviewListItemDTO>>(
      API_ENDPOINTS.MY_BOOK_REVIEW.COMMENTED,
      { params },
    ),
  fetchMyBookReviewDetail: async (myBookId) =>
    await apiClient.get<MyBookReviewDetailDTO>(
      API_ENDPOINTS.MY_BOOK_REVIEW.BY_MY_BOOK_ID(myBookId),
    ),
};
