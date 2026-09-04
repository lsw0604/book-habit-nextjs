import * as isbn3 from "isbn3";

import { formatDate } from "@/shared/lib";

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

export const formatISBN = (rawISBN: string): string => {
  if (!rawISBN) return "";

  const parts = rawISBN.split(" ");

  // 완벽한 ISBN-13(978/979)이 하나라도 있으면 최우선으로 쓴다.
  const original13 = parts.find((part) => {
    const parsed = isbn3.parse(part);
    return parsed?.isIsbn13 && parsed?.isValid;
  });
  if (original13) return isbn3.asIsbn13(original13, false)!;

  // ISSN(977)은 ISBN-10 변환 대상이 아니라 먼저 걸러야 한다. 뒤 루프로
  // 넘어가면 977 코드가 엉뚱하게 변환/버려진다.
  const issnPart = parts.find((part) => {
    const cleanCode = part.replace(/[^0-9]/g, "");
    return /^977\d{10}$/.test(cleanCode);
  });
  if (issnPart) return issnPart.replace(/[^0-9]/g, "");

  // 마지막으로 ISBN-10 → 13 변환을 시도한다.
  for (const part of parts) {
    const converted = isbn3.asIsbn13(part, false);
    if (converted) return converted;
  }

  return "";
};
