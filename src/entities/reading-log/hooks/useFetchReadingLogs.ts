"use client";

import { useQuery } from "@tanstack/react-query";

import type { APIError, ResponsePagination } from "@/shared/api";

import {
  readingLogQueryKeys,
  readingLogService,
  type ReadingLogListItemDTO,
  type ReadingLogListParamsDTO,
} from "../api";
import { selectReadingLogList } from "../lib";
import type { ReadingLogSummary } from "../model";

/** 독서 기록 목록을 조회한다. `meta`를 버리지 않는 이유는 `selectReadingLogList` 참고. */
export const useFetchReadingLogs = (params: ReadingLogListParamsDTO = {}) => {
  const { fetchReadingLogs } = readingLogService;

  return useQuery<
    ResponsePagination<ReadingLogListItemDTO>,
    APIError,
    ResponsePagination<ReadingLogSummary>
  >({
    queryKey: readingLogQueryKeys.list(params).queryKey,
    queryFn: () => fetchReadingLogs(params),
    select: selectReadingLogList,
  });
};
