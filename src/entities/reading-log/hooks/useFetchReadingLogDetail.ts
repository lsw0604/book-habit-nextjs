"use client";

import { useQuery } from "@tanstack/react-query";

import type { APIError } from "@/shared/api";

import {
  readingLogQueryKeys,
  readingLogService,
  type ReadingLogDetailDTO,
} from "../api";
import { toReadingLogDetailViewModel } from "../lib";
import type { ReadingLogDetail } from "../model";

export const useFetchReadingLogDetail = (id: number) => {
  const { fetchReadingLogDetail } = readingLogService;

  return useQuery<ReadingLogDetailDTO, APIError, ReadingLogDetail>({
    queryKey: readingLogQueryKeys.detail(id).queryKey,
    queryFn: () => fetchReadingLogDetail(id),
    select: toReadingLogDetailViewModel,
    // 라우트 파라미터가 숫자가 아니면 NaN이 된다. 그 상태로 조회하면 무의미한 404다.
    enabled: Number.isFinite(id),
  });
};
