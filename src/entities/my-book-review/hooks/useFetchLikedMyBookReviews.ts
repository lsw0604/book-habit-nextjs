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

/** 내가 좋아요 누른 한줄평 목록을 조회한다(접근 가능한 것만 — 이후 비공개로 바뀐 글은 제외). */
export const useFetchLikedMyBookReviews = (
  params: MyBookReviewListParamsDTO = {},
) => {
  const { fetchLikedMyBookReviews } = myBookReviewService;

  return useQuery<
    ResponsePagination<MyBookReviewListItemDTO>,
    APIError,
    ResponsePagination<MyBookReviewSummary>
  >({
    queryKey: myBookReviewQueryKeys.liked(params).queryKey,
    queryFn: () => fetchLikedMyBookReviews(params),
    select: selectMyBookReviewList,
  });
};
