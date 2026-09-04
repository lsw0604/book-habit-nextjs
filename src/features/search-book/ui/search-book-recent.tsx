"use client";

import { SearchIcon, XIcon } from "lucide-react";
import Link from "next/link";

import { BookCard, useRecentBooks } from "@/entities/book";
import { Button, EmptyState } from "@/shared/ui";

/**
 * 검색어를 입력하기 전 목록 자리를 채운다.
 *
 * 최근 본 책이 없으면(첫 방문·전부 삭제) 원래의 안내만 남긴다. DESIGN.md ⑦의
 * "빈 화면은 조용히 비워 둔다"는 **보여줄 게 없을 때**의 규칙이고, 목록이 있으면
 * 그건 빈 화면이 아니다.
 */
export function SearchBookRecent() {
  const { books, removeBook } = useRecentBooks();

  if (books.length === 0) {
    return (
      <EmptyState
        icon={SearchIcon}
        title="책을 검색해 보세요"
        description="제목·저자·출판사·ISBN으로 찾을 수 있어요. 필터에서 검색 대상과 정렬을 바꿀 수 있습니다."
      />
    );
  }

  return (
    <section className="flex min-w-0 flex-col gap-2 p-4">
      {/* 검색 결과가 아니라 곁들이는 정보라 Micro 스케일로 물러나 있는다. */}
      <h2 className="text-xs leading-[1.4] font-medium text-muted-foreground">
        최근 본 책
      </h2>

      <ul className="flex min-w-0 flex-col divide-y divide-border">
        {books.map((book) => (
          /*
           * 삭제 버튼을 Link 안에 넣으면 `<a>` 안의 `<button>`이 되어 HTML 규격과
           * 키보드 동작이 모두 깨진다. 형제로 두고 Link가 남은 폭을 차지한다.
           */
          <li
            key={book.identifier.value}
            className="flex min-w-0 items-center gap-1"
          >
            <Link
              href={`/search/${book.identifier.value}`}
              className="min-w-0 flex-1 rounded-lg transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <BookCard book={book} />
            </Link>

            {/*
             * 목록에서 빼는 것뿐이라 destructive를 쓰지 않는다(DESIGN.md ④ — 그건
             * 실제 삭제 액션 전용이다). hover에서만 드러내는 방식도 쓰지 않는다 —
             * 터치 기기에는 hover가 없어 영영 닿지 못한다.
             */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeBook(book.identifier.value)}
              aria-label={`${book.title}을(를) 최근 본 책에서 삭제`}
              className="shrink-0 text-muted-foreground hover:text-foreground"
            >
              <XIcon />
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
