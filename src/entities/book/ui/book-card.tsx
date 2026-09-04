import { BookCardThumbnail } from "./book-card-thumbnail";

import type { BookSummary } from "../model";

interface BookCardProps {
  book: BookSummary;
}

/**
 * 검색 결과·목록에서 쓰는 책 요약 로우. Linear식 컴팩트 리스트라 Card로
 * 감싸지 않는다 — 구분은 감싸는 쪽(feature)의 `divide-y`가 맡는다.
 * 인터랙션 없는 순수 표시 컴포넌트라 클릭·링크도 감싸는 feature가 붙인다.
 */
export function BookCard({ book }: BookCardProps) {
  return (
    <div className="flex w-full min-w-0 items-center gap-3 p-2">
      <div className="h-16 w-11 shrink-0">
        <BookCardThumbnail src={book.thumbnail} alt={`${book.title} 표지`} />
      </div>
      <div className="flex min-w-0 flex-col justify-center gap-1">
        <h3 className="truncate text-base font-semibold text-title">
          {book.title}
        </h3>
        <p className="truncate text-sm text-muted-foreground">{book.authors}</p>
        <p className="truncate text-xs text-muted-foreground">
          {book.publisher} · {book.pubDate}
        </p>
      </div>
    </div>
  );
}
