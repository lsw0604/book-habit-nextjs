import type { ResponsePagination } from "@/shared/api";

import type { MyBookReviewListItemDTO } from "../api";
import type { MyBookReviewSummary } from "../model";
import { toMyBookReviewSummaryViewModel } from "./my-book-review.mapper";

/**
 * `meta`를 버리지 않는다 — BE 기본 `limit`이 10이라 `hasNextPage`가 필요하다
 * (`entities/reading-log`의 `selectReadingLogList`와 같은 이유). 모듈 레벨에 둬
 * 참조를 고정한다(인라인 화살표는 렌더마다 새 함수라 TanStack Query가 재사용 못 한다).
 */
export const selectMyBookReviewList = (
  data: ResponsePagination<MyBookReviewListItemDTO>,
): ResponsePagination<MyBookReviewSummary> => ({
  meta: data.meta,
  items: data.items.map(toMyBookReviewSummaryViewModel),
});
