import * as isbn3 from "isbn3";

import { formatDate } from "@/shared/lib";

import type { BookIdentifier } from "../model";

export const formatAuthor = (authors: string[]): string => {
  if (authors.length === 0) return "미상";
  if (authors.length === 1) return authors[0];
  return `${authors[0]} 외 ${authors.length - 1}명`;
};

export const formatTranslator = (translators: string[]): string => {
  if (translators.length === 0) return "-";
  if (translators.length === 1) return `${translators[0]} 역`;
  return `${translators[0]} 외 ${translators.length - 1}명 역`;
};

export const formatPubDate = (pubDate: string | null): string =>
  pubDate ? formatDate(pubDate, "medium") : "알 수 없음";

export const formatTotalPage = (page: number | null): string =>
  page ? `${page}쪽` : "알 수 없음";

/**
 * 알라딘 설명 필드는 `<br>`로 줄바꿈을 표현한다. `dangerouslySetInnerHTML` 없이
 * 렌더링할 수 있도록 줄바꿈만 남기고 나머지 태그는 제거한다.
 */
export const formatDescription = (description: string | null): string | null => {
  if (!description) return null;

  const plainText = description
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .trim();

  return plainText || null;
};

/**
 * EAN-13 체크디지트 검증. ISBN-13(978·979)과 ISSN 바코드(977)가 같은 규칙을 쓴다.
 *
 * 홀수 자리에 1, 짝수 자리에 3을 곱해 더한 뒤 10의 보수가 마지막 자리와 같아야 한다.
 */
const isValidEan13 = (digits: string): boolean => {
  if (!/^\d{13}$/.test(digits)) return false;

  const sum = digits
    .slice(0, 12)
    .split("")
    .reduce(
      (acc, digit, index) => acc + Number(digit) * (index % 2 === 0 ? 1 : 3),
      0,
    );

  return (10 - (sum % 10)) % 10 === Number(digits[12]);
};

/**
 * 원본 식별자 문자열을 13자리 하나로 좁히고 종류까지 함께 돌려준다.
 *
 * 카카오는 `"8937460777 9788937460777"`처럼 ISBN-10과 ISBN-13을 공백으로 붙여 준다.
 * 13자리로 통일하는 이유는 그것이 상위집합이기 때문이다 — ISBN-10은 언제나 13으로
 * 변환되지만, `979`로 시작하는 ISBN-13에는 대응하는 ISBN-10이 없다. 상세 조회 URL과
 * BE의 CREATE or FIND가 이 값을 키로 쓰므로 표현이 갈리면 같은 책이 둘로 쪼개진다.
 *
 * **ISSN은 ISBN이 아니다.** 정본은 8자리이고 `977…` 13자리는 바코드(EAN-13) 표현일
 * 뿐이라 `isbn3`가 파싱하지 못한다. 그래서 체크디지트를 직접 검증하고, 종류를 `type`에
 * 남겨 호출부가 "잡지라서 상세가 없다"와 "식별자를 못 읽었다"를 구분할 수 있게 한다.
 *
 * ## 탐색 순서를 바꾸면 안 된다
 *
 * `ISBN-10 → 13` 변환은 **언제나 `978`을 붙인다.** 그런데 `979-11-…`(한국 출판사에
 * 흔하다)은 ISBN-10이 아예 존재하지 않는 그룹이라, 카카오는 그런 책에도 앞 3자리를
 * 떼고 체크디지트를 재계산한 **가짜 ISBN-10**을 함께 준다.
 *
 * ```
 * "1186179511 9791186179512"
 *   → 앞쪽을 먼저 변환하면 9781186179513  (존재하지 않는 책)
 *   → 뒤쪽 원본 13자리가 정답  9791186179512
 * ```
 *
 * 두 값 다 체크디지트는 유효해서 검증으로는 못 거른다. **원본이 이미 13자리인 것을
 * 최우선으로 집는 순서**만이 이걸 막는다.
 */
export const normalizeIdentifier = (
  raw: string | null | undefined,
): BookIdentifier | null => {
  if (!raw) return null;

  const parts = raw.trim().split(/\s+/);

  // 1) 원본이 이미 ISBN-13이면 최우선. 변환을 거치지 않으므로 접두사가 보존된다.
  for (const part of parts) {
    const parsed = isbn3.parse(part);
    if (parsed?.isValid && parsed.isIsbn13) {
      return { value: parsed.isbn13, type: "ISBN" };
    }
  }

  // 2) ISSN 바코드. ISBN-10 변환보다 먼저 걸러야 977 코드가 엉뚱하게 처리되지 않는다.
  //    형식만 보고 통과시키면 깨진 코드가 URL과 BE 조회까지 흘러가 404로 끝난다.
  for (const part of parts) {
    const digits = part.replace(/\D/g, "");
    if (digits.startsWith("977") && isValidEan13(digits)) {
      return { value: digits, type: "ISSN" };
    }
  }

  // 3) 마지막 수단. 원본에 13자리가 아예 없을 때만 ISBN-10을 변환한다.
  for (const part of parts) {
    const parsed = isbn3.parse(part);
    if (parsed?.isValid) return { value: parsed.isbn13, type: "ISBN" };
  }

  return null;
};
