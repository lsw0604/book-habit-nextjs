import type { InfiniteData } from "@tanstack/react-query";

import { toSummaryBookViewModel, type BookSummary } from "@/entities/book";

import type { SearchBookDTO } from "../api";

/**
 * 모듈 레벨에 두어 참조를 고정한다.
 * 인라인 화살표는 렌더마다 새 함수가 되어 TanStack Query가 이전 결과를 재사용하지 못하고,
 * 데이터가 그대로여도 누적된 검색 결과 전체를 다시 변환한다.
 */
export const selectBookSummaries = (data: InfiniteData<SearchBookDTO>): BookSummary[] =>
  data.pages.flatMap((page) => page.items.map((i) => toSummaryBookViewModel(i)));
