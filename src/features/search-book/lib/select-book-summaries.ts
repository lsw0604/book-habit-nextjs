import type { InfiniteData } from "@tanstack/react-query";

import { toSummaryBookViewModel, type BookSummary } from "@/entities/book";

import type { SearchBookDTO } from "../api";

/**
 * 무한 스크롤로 누적된 페이지를 화면용 목록 하나로 편다.
 *
 * ## 모듈 레벨에 두는 이유
 *
 * 인라인 화살표는 렌더마다 새 함수가 되어 TanStack Query가 이전 결과를 재사용하지
 * 못하고, 데이터가 그대로여도 누적된 검색 결과 전체를 다시 변환한다.
 *
 * ## ISBN 중복을 걷어내는 이유
 *
 * 같은 책이 두 번 실리면 React key가 충돌하고, 그보다 먼저 **사용자가 같은 책을
 * 두 번 본다.** 두 경로로 생긴다.
 *
 * 1. 카카오 검색은 페이지 경계에서 같은 책을 다시 준다. `accuracy` 정렬은 순위가
 *    고정이 아니라, 다음 페이지를 받을 때 앞 페이지의 항목이 밀려 들어올 수 있다.
 * 2. `normalizeIdentifier`가 ISBN-10을 13자리로 통일하므로, 원본 문자열이 다르던
 *    두 항목이 같은 값으로 수렴한다. 이건 정규화의 부작용이 아니라 **목적**이다 —
 *    정규화가 없었다면 같은 책이 그냥 두 번 보였을 것이고, 그게 더 나쁘다.
 *
 * 식별자가 `null`인 항목은 걸러내지 않는다. 읽을 수 없다는 것이 같은 책이라는 뜻은
 * 아니므로, 지웠다가는 멀쩡한 검색 결과가 사라진다(호출부가 index를 섞어 key를 만든다).
 */
export const selectBookSummaries = (
  data: InfiniteData<SearchBookDTO>,
): BookSummary[] => {
  const seen = new Set<string>();
  const books: BookSummary[] = [];

  for (const page of data.pages) {
    for (const item of page.items) {
      const book = toSummaryBookViewModel(item);

      if (book.identifier) {
        if (seen.has(book.identifier.value)) continue;
        seen.add(book.identifier.value);
      }

      books.push(book);
    }
  }

  return books;
};
