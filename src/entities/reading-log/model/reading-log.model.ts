/** 독서 기록 한 줄. `date`가 문자열이 아닌 `Date`인 이유는 `groupItemsByDate`/`toDateKey`가 그대로 요구해서다. */
export interface ReadingLogSummary {
  id: number;
  myBookId: number;
  startPage: number;
  endPage: number;
  /** `endPage - startPage`. */
  pagesRead: number;
  date: Date;
  /** `14:00 - 14:30` 형태. */
  timeRangeLabel: string;
  readingMinutes: number;
  /** `1시간 35분` 형태. */
  durationLabel: string;
  memo: string | null;
  title: string;
  thumbnail: string | null;
}

/** 독서 기록 단건 상세. 목록과 달리 책 정보가 없다(BE가 이미 MyBook 맥락 안에서 조회한다고 본다). */
export interface ReadingLogDetail {
  id: number;
  myBookId: number;
  startPage: number;
  endPage: number;
  pagesRead: number;
  date: Date;
  timeRangeLabel: string;
  readingMinutes: number;
  durationLabel: string;
  memo: string | null;
}
