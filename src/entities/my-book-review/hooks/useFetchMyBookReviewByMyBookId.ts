"use client";

import { useQuery } from "@tanstack/react-query";

import type { APIError } from "@/shared/api";

import {
  myBookReviewQueryKeys,
  myBookReviewService,
  type MyBookReviewDetailDTO,
} from "../api";
import { toMyBookReviewDetailViewModel } from "../lib";
import type { MyBookReviewDetail } from "../model";

/** `library/[id]` 같은 MyBook 상세 화면에서 그대로 쓸 수 있다. */
export const useFetchMyBookReviewByMyBookId = (myBookId: number) => {
  const { fetchMyBookReviewByMyBookId } = myBookReviewService;

  return useQuery<MyBookReviewDetailDTO, APIError, MyBookReviewDetail>({
    queryKey: myBookReviewQueryKeys.detail(myBookId).queryKey,
    queryFn: () => fetchMyBookReviewByMyBookId(myBookId),
    select: toMyBookReviewDetailViewModel,
    // 라우트 파라미터가 숫자가 아니면 NaN이 된다. 그 상태로 조회하면 무의미한 404다.
    enabled: Number.isFinite(myBookId),
  });
};
