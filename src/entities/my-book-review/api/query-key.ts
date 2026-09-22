import { createQueryKeys } from "@lukemorales/query-key-factory";

import type { MyBookReviewListParamsDTO } from "./my-book-review.dto";

export const myBookReviewQueryKeys = createQueryKeys("my-book-review", {
  list: (params: MyBookReviewListParamsDTO) => ({
    queryKey: [params],
  }),
  liked: (params: MyBookReviewListParamsDTO) => ({
    queryKey: [params],
  }),
  commented: (params: MyBookReviewListParamsDTO) => ({
    queryKey: [params],
  }),
  /** `id`가 아니라 `myBookId` — `MY_BOOK_REVIEW.BY_MY_BOOK_ID` 참고. */
  detail: (myBookId: number) => ({
    queryKey: [myBookId],
  }),
});
