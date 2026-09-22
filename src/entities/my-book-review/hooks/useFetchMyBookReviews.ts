"use client";

import { useQuery } from "@tanstack/react-query";

import type { APIError, ResponsePagination } from "@/shared/api";

import {
  myBookReviewQueryKeys,
  myBookReviewService,
  type MyBookReviewListItemDTO,
  type MyBookReviewListParamsDTO,
} from "../api";
import { selectMyBookReviewList } from "../lib";
import type { MyBookReviewSummary } from "../model";

/** 내가 작성한 한줄평 목록을 조회한다. `meta`를 버리지 않는 이유는 `selectMyBookReviewList` 참고. */
export const useFetchMyBookReviews = (
  params: MyBookReviewListParamsDTO = {},
) => {
  const { fetchMyBookReviews } = myBookReviewService;

  return useQuery<
    ResponsePagination<MyBookReviewListItemDTO>,
    APIError,
    ResponsePagination<MyBookReviewSummary>
  >({
    queryKey: myBookReviewQueryKeys.list(params).queryKey,
    queryFn: () => fetchMyBookReviews(params),
    select: selectMyBookReviewList,
  });
};
