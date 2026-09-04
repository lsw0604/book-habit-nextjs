import type { ReactNode } from "react";

import { BookCardThumbnail } from "./book-card-thumbnail";

import type { BookSummary } from "../model";

/**
 * 이 카드가 실제로 그리는 필드만 요구한다. 덕분에 `BookSummary`(검색 결과)와
 * `RecentBook`(최근 본 책)을 둘 다 그대로 받을 수 있다.
 */
type BookCardBook = Pick<
  BookSummary,
  "title" | "authors" | "publisher" | "pubDate" | "thumbnail"
>;

interface BookCardProps {
  book: BookCardBook;
  /**
   * 로우 오른쪽 끝에 붙는 부가 요소(배지·버튼 등).
   *
   * 무엇을 붙일지는 목록을 소유한 쪽이 정한다. 예를 들어 "이 책은 선택할 수
   * 없다"는 판단은 검색 결과의 사정이지 책 자체의 속성이 아니다.
   */
  trailing?: ReactNode;
}

/**
 * 검색 결과·목록에서 쓰는 책 요약 로우. Linear식 컴팩트 리스트라 Card로
 * 감싸지 않는다 — 구분은 감싸는 쪽(feature)의 `divide-y`가 맡는다.
 * 인터랙션 없는 순수 표시 컴포넌트라 클릭·링크도 감싸는 feature가 붙인다.
 */
export function BookCard({ book, trailing }: BookCardProps) {
  return (
    <div className="flex w-full min-w-0 items-center gap-3 p-2">
      <div className="h-16 w-11 shrink-0">
        <BookCardThumbnail src={book.thumbnail} alt={`${book.title} 표지`} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
        <h3 className="truncate text-base font-semibold text-title">
          {book.title}
        </h3>
        <p className="truncate text-sm text-muted-foreground">{book.authors}</p>
        <p className="truncate text-xs text-muted-foreground">
          {book.publisher} · {book.pubDate}
        </p>
      </div>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </div>
  );
}
