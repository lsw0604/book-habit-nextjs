import type { SearchBookParams } from "../model";

export const SEARCH_BOOK_PATH = "/search";

/**
 * 빈 값은 URL에 싣지 않는다 — query가 아직 비어 있을 때 `?query=`로 지저분해지는 걸 막는다.
 *
 * `pathname`을 받는 이유: 이 폼은 layout에 있어 `/search/[isbn]` 상세에서도 렌더된다.
 * 필터 변경까지 목록 경로로 되돌리면 사용자가 보고 있던 책이 닫힌다. 그래서 필터는
 * 현재 경로를 넘겨 제자리에 머물고, 새 검색어 제출만 기본값(목록)으로 이동한다.
 */
export function buildSearchBookUrl(
  params: SearchBookParams,
  pathname: string = SEARCH_BOOK_PATH,
): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === "" || value === undefined || value === null) return;
    searchParams.set(key, String(value));
  });

  const query = searchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}
