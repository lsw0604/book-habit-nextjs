import type { ResponsePagination } from "@/shared/api";

import type { MyBookListItemDTO } from "../api";
import type { MyBookSummary } from "../model";
import { toMyBookSummaryViewModel } from "./my-book.mapper";

/**
 * 모듈 레벨에 두어 참조를 고정한다. 인라인 화살표는 렌더마다 새 함수가 되어
 * TanStack Query가 이전 결과를 재사용하지 못하고, 데이터가 그대로여도 목록
 * 전체를 다시 변환한다.
 */
export const selectMyBookSummaries = (
  data: ResponsePagination<MyBookListItemDTO>,
): MyBookSummary[] => data.items.map(toMyBookSummaryViewModel);
