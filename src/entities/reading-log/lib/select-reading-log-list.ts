import type { ResponsePagination } from "@/shared/api";

import type { ReadingLogListItemDTO } from "../api";
import type { ReadingLogSummary } from "../model";
import { toReadingLogSummaryViewModel } from "./reading-log.mapper";

/**
 * `meta`를 버리지 않는다 — my-book과 달리 BE 기본 `limit`이 20이라 `hasNextPage`가
 * 필요하다. 모듈 레벨에 둬 참조를 고정한다(인라인 화살표는 렌더마다 새 함수라
 * TanStack Query가 재사용 못 한다).
 */
export const selectReadingLogList = (
  data: ResponsePagination<ReadingLogListItemDTO>,
): ResponsePagination<ReadingLogSummary> => ({
  meta: data.meta,
  items: data.items.map(toReadingLogSummaryViewModel),
});
