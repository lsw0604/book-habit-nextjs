/** `GET /api/reading-log` 목록 아이템의 책 정보(`ReadingLogListBookDto`). */
export interface ReadingLogListBookDTO {
  title: string;
  thumbnail: string | null;
}

/** `GET /api/reading-log` 목록 아이템(`ReadingLogListItemDto`). */
export interface ReadingLogListItemDTO {
  id: number;
  myBookId: number;
  startPage: number;
  endPage: number;
  startTime: string;
  endTime: string;
  readingMinutes: number;
  date: string;
  memo: string | null;
  createdAt: string;
  updatedAt: string;
  book: ReadingLogListBookDTO;
}

/** `GET /api/reading-log` 쿼리 파라미터. */
export interface ReadingLogListParamsDTO {
  /** 특정 MyBook의 기록만 조회. 미지정 시 내 전체 기록. */
  myBookId?: number;
  /** 조회 시작 날짜 (YYYY-MM-DD, 해당일 포함). */
  from?: string;
  /** 조회 종료 날짜 (YYYY-MM-DD, 해당일 포함). */
  to?: string;
  page?: number;
  limit?: number;
}

/** `GET /api/reading-log/{id}`(`ReadingLogResponseDto`). 목록과 달리 `book`이 없다. */
export interface ReadingLogDetailDTO {
  id: number;
  myBookId: number;
  startPage: number;
  endPage: number;
  startTime: string;
  endTime: string;
  readingMinutes: number;
  date: string;
  memo: string | null;
  createdAt: string;
  updatedAt: string;
}
