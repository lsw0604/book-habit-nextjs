import {
  BOOK_SEARCH_SIZE_OPTIONS,
  BOOK_SEARCH_SORT_OPTIONS,
  BOOK_SEARCH_TARGET_OPTIONS,
} from "../constants";
import { DEFAULT_SEARCH_BOOK_PARAMS } from "../model";
import type { SearchBookParams } from "../model";

export interface SearchFilterChip {
  key: "target" | "sort" | "size";
  /** 필터 항목 이름. 배지만 봐서는 "10개"가 무엇의 10개인지 알 수 없어 함께 읽힌다. */
  name: string;
  label: string;
  /** 기본값 그대로인지. 호출부가 강조 여부를 정하는 데 쓴다. */
  isDefault: boolean;
}

function findLabel<TValue extends string | number>(
  options: ReadonlyArray<{ label: string; value: TValue }>,
  value: TValue,
): string {
  return options.find((option) => option.value === value)?.label ?? String(value);
}

/**
 * 현재 검색 필터를 배지로 보여줄 형태로 풀어낸다.
 *
 * 라벨을 UI에 적지 않고 옵션 상수에서 찾는 이유는 Popover 안의 선택지와 요약
 * 배지가 **반드시 같은 문자열**이어야 하기 때문이다. 양쪽에 따로 적으면
 * "작가"를 "저자"로 바꿀 때 한쪽만 바뀌어 서로 다른 이름이 된다.
 */
export function describeSearchFilters(
  params: SearchBookParams,
): SearchFilterChip[] {
  return [
    {
      key: "target",
      name: "검색 대상",
      label: findLabel(BOOK_SEARCH_TARGET_OPTIONS, params.target),
      isDefault: params.target === DEFAULT_SEARCH_BOOK_PARAMS.target,
    },
    {
      key: "sort",
      name: "정렬",
      label: findLabel(BOOK_SEARCH_SORT_OPTIONS, params.sort),
      isDefault: params.sort === DEFAULT_SEARCH_BOOK_PARAMS.sort,
    },
    {
      key: "size",
      name: "페이지당 결과 수",
      label: findLabel(BOOK_SEARCH_SIZE_OPTIONS, params.size),
      isDefault: params.size === DEFAULT_SEARCH_BOOK_PARAMS.size,
    },
  ];
}
