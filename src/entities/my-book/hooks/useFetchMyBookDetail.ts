"use client";

import { useQuery } from "@tanstack/react-query";

import type { APIError } from "@/shared/api";

import { myBookQueryKeys, myBookService, type MyBookDetailDTO } from "../api";
import { toMyBookDetailViewModel } from "../lib";
import type { MyBookDetail } from "../model";

export const useFetchMyBookDetail = (id: number) => {
  const { fetchMyBookDetail } = myBookService;

  return useQuery<MyBookDetailDTO, APIError, MyBookDetail>({
    queryKey: myBookQueryKeys.detail(id).queryKey,
    queryFn: () => fetchMyBookDetail(id),
    select: toMyBookDetailViewModel,
    // 라우트 파라미터가 숫자가 아니면 NaN이 된다. 그 상태로 조회하면 무의미한 404다.
    enabled: Number.isFinite(id),
  });
};
