export interface PaginationMeta {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  /** 해당 페이지가 없으면 `null`이 아니라 키가 생략된다. */
  nextPage?: number;
  /** 해당 페이지가 없으면 `null`이 아니라 키가 생략된다. */
  prevPage?: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * 목록 조회 엔드포인트의 `data` 페이로드.
 *
 * 페이지네이션을 쓰는 5개 응답 DTO가 예외 없이 이 형태다 —
 * my-book, reading-log, my-book-review, public-review 목록과 카카오 도서 검색.
 */
export interface ResponsePagination<TItem> {
  meta: PaginationMeta;
  items: TItem[];
}
