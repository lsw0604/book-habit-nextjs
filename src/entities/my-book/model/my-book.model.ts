/**
 * 서재 상태. BE의 `MyBookStatus`와 값이 같아야 한다.
 *
 * `api/`가 아니라 여기 있는 이유는, 이 셋이 서버 통신 형식이 아니라 도메인
 * 어휘이기 때문이다 — BE가 없어도 존재하는 개념이고 `ui`·`model`이 함께 쓴다.
 *
 * enum이 아닌 `as const`인 이유는 **wire 값과 도메인 값이 같기 때문**이다.
 * `entities/user`의 `Gender`는 도메인이 `UNKNOWN`을 더 갖는 등 wire와 갈라져서
 * enum의 nominal 타입으로 매퍼를 강제하는 것이 이득이지만, 여기는 변환이 없어
 * (`lib/my-book.mapper.ts`가 `status: dto.status`로 통과시킨다) 벽을 세울 대상이
 * 없다. 판단 근거는 `docs/decision-domain-enums.md`.
 */
export const MY_BOOK_STATUS = {
  WANT_TO_READ: "WANT_TO_READ",
  CURRENTLY_READING: "CURRENTLY_READING",
  READ: "READ",
} as const;

export type MyBookStatus =
  (typeof MY_BOOK_STATUS)[keyof typeof MY_BOOK_STATUS];

/**
 * 서재 목록 한 줄에 필요한 값.
 *
 * `entities/book`의 `BookSummary`를 재사용하지 않는 이유는 골든룰 3(같은 레이어
 * 슬라이스 간 참조 금지)이다. 실제로 BE도 목록에는 세 필드만 내려주므로,
 * 억지로 공유했다면 대부분이 빈 값인 타입을 들고 다니게 된다.
 */
export interface MyBookSummary {
  /** 서재 항목의 식별자. 책의 ISBN이 아니다. */
  id: number;
  status: MyBookStatus;
  /** 0~5. 0은 "아직 평가하지 않음"이다. */
  rating: number;
  currentPage: number;
  readCount: number;
  title: string;
  thumbnail: string | null;
  totalPage: number | null;
  /**
   * 0~100 진행률. 총 페이지를 모르는 책이 있어 `null`이 될 수 있다 —
   * 그때는 진행 바 대신 다른 표시를 해야 하므로 0으로 뭉개지 않는다.
   */
  progress: number | null;
}

/**
 * 서재 항목 상세. 목록과 달리 "내 독서 상태"가 주인공이라 날짜·횟수까지 담는다.
 *
 * 책 자체의 정보(`book`)는 표시용으로 이미 가공된 값이다 — 원본 배열이나 null을
 * 화면까지 들고 가면 뷰마다 같은 분기를 반복하게 된다.
 */
export interface MyBookDetail {
  id: number;
  status: MyBookStatus;
  rating: number;
  currentPage: number;
  readCount: number;
  progress: number | null;
  /** 없으면 `null`. 호출부가 줄을 통째로 뺀다. */
  startedAt: string | null;
  finishedAt: string | null;
  lastReadAt: string | null;
  /** `234 / 380쪽` 형태. */
  pageProgressLabel: string;
  book: {
    title: string;
    subTitle: string | null;
    authors: string[];
    translators: string[];
    publisher: string | null;
    pubDate: string | null;
    coverImage: string | null;
    description: string | null;
    totalPage: number | null;
  };
  counts: {
    readingLog: number;
    /** 0 또는 1. BE가 개수로 주지만 의미는 "작성 여부"다. */
    review: number;
  };
}
