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

/** 내가 댓글단 한줄평 목록을 조회한다(접근 가능한 것만, 리뷰당 1건). */
export const useFetchCommentedMyBookReviews = (
  params: MyBookReviewListParamsDTO = {},
) => {
  const { fetchCommentedMyBookReviews } = myBookReviewService;

  return useQuery<
    ResponsePagination<MyBookReviewListItemDTO>,
    APIError,
    ResponsePagination<MyBookReviewSummary>
  >({
    queryKey: myBookReviewQueryKeys.commented(params).queryKey,
    queryFn: () => fetchCommentedMyBookReviews(params),
    select: selectMyBookReviewList,
  });
};
