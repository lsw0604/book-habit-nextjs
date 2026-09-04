export type BookIdentifierType = "ISBN" | "ISSN";

/**
 * 정규화된 도서 식별자.
 *
 * 값과 종류를 한 덩어리로 묶는다. 예전처럼 `isbn: string` 하나만 두면
 * "값은 비었는데 종류는 ISBN" 같은 불가능한 상태가 타입상 표현 가능해지고,
 * 호출부가 `isbn === ""`을 매번 확인해야 한다.
 */
export interface BookIdentifier {
  /** 13자리 EAN-13. ISBN은 978·979로, ISSN 바코드는 977로 시작한다. */
  value: string;
  type: BookIdentifierType;
}

export interface BookDetail {
  /** 정규화에 실패하면 `null`. 원본이 비었거나 체크디지트가 깨진 경우다. */
  identifier: BookIdentifier | null;
  title: string;
  authors: string;
  translators: string;
  publisher: string | null;
  pubDate: string;
  description: string | null;
  thumbnail: string | null;
  coverImage: string | null;
  subTitle: string | null;
  totalPage: string;
  url: string | null;
  stockStatus: string | null;
}

/**
 * 최근 본 책. 상세 화면에 들어간 이력을 로컬에 남겨 검색 전 화면에서 다시 꺼낸다.
 *
 * `BookSummary`를 통째로 저장하지 않는 이유는 `description`처럼 긴 필드가 섞여
 * localStorage를 낭비하기 때문이다. `BookCard`가 그리는 데 필요한 만큼만 담는다.
 * 최신순 정렬은 배열 순서가 대신하므로 타임스탬프도 두지 않는다.
 */
export interface RecentBook {
  /** ISSN은 상세로 갈 수 없어 애초에 기록되지 않는다. */
  identifier: BookIdentifier;
  title: string;
  authors: string;
  publisher: string | null;
  pubDate: string;
  thumbnail: string | null;
}

export interface BookSummary {
  /** 정규화에 실패하면 `null`. 이 경우 상세로 이동할 수 없다. */
  identifier: BookIdentifier | null;
  title: string;
  authors: string;
  translators: string;
  status: string | null;
  pubDate: string;
  publisher: string | null;
  thumbnail: string | null;
  description: string | null;
}
