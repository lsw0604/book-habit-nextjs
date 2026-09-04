"use client";

import { AlertTriangleIcon, RotateCcwIcon, SearchXIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { BookCard, useRecentBooks } from "@/entities/book";
import type { BookIdentifier } from "@/entities/book";
import { useInfiniteScroll, useQueryParams } from "@/shared/hooks";
import { cn } from "@/shared/lib";
import { Badge, Button, EmptyState, Skeleton } from "@/shared/ui";

import { useSearchBook } from "../hooks";
import { DEFAULT_SEARCH_BOOK_PARAMS, searchBookParamsSchema } from "../model";

import { SearchBookRecent } from "./search-book-recent";

const INITIAL_SKELETON_ROWS = 7;
const NEXT_PAGE_SKELETON_ROWS = 2;

export function SearchBookList() {
  const searchParams = useSearchParams();
  const params = useQueryParams(
    searchBookParamsSchema,
    DEFAULT_SEARCH_BOOK_PARAMS,
  );

  const {
    data,
    error,
    isPending,
    isError,
    isPlaceholderData,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useSearchBook(params);
  const ref = useInfiniteScroll(fetchNextPage, hasNextPage, {});
  const { trackBook } = useRecentBooks();

  // 검색어가 없는 상태를 isPending보다 **먼저** 거른다. useSearchBook이
  // `enabled: Boolean(params.query)`로 쿼리를 멈춰두는데, 멈춘 쿼리는
  // isPending이 true로 남는다. 순서를 바꾸면 검색 전 화면에 스켈레톤이 영원히 돈다.
  if (!params.query) {
    return <SearchBookRecent />;
  }

  if (isPending) {
    return (
      <ul
        aria-busy
        aria-label="검색 결과를 불러오는 중"
        className="flex min-w-0 flex-col divide-y divide-border px-4"
      >
        <ResultRowSkeletons count={INITIAL_SKELETON_ROWS} />
      </ul>
    );
  }

  if (isError) {
    return (
      <EmptyState
        variant="error"
        icon={AlertTriangleIcon}
        title="검색에 실패했어요"
        description={error.userMessage}
      >
        <Button variant="ghost" size="sm" onClick={() => refetch()}>
          <RotateCcwIcon />
          다시 시도
        </Button>
      </EmptyState>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        icon={SearchXIcon}
        title={`'${params.query}' 검색 결과가 없어요`}
        description="다른 검색어를 넣거나, 필터에서 검색 대상을 바꿔 보세요."
      />
    );
  }

  return (
    <ul
      // 필터·검색어가 바뀌어 새 결과를 받아오는 동안. 목록을 스켈레톤으로
      // 갈아끼우지 않고 이전 결과를 흐리게만 둔다 — 보고 있던 항목이 사라지면
      // 어디를 보던 중이었는지 감각을 잃는다.
      aria-busy={isPlaceholderData}
      className={cn(
        "flex min-w-0 flex-col divide-y divide-border px-4 transition-opacity duration-150",
        isPlaceholderData && "opacity-60",
      )}
    >
      {/*
       * 식별자를 읽지 못한 책이 섞여 있어 key fallback이 필요하다. index를 써도
       * 안전한 건 이 목록이 append-only이기 때문이다 — selector가 중복을 앞에서부터
       * 걷어내므로 페이지가 늘어나도 앞쪽 인덱스는 밀리지 않는다.
       */}
      {data.map((book, index) => {
        // 좁힌 타입을 클로저(onClick)까지 들고 가려면 지역 변수로 뽑아야 한다.
        const { identifier } = book;

        return (
          <li
            key={identifier?.value ?? `${book.title}-${index}`}
            className="min-w-0"
          >
            {identifier?.type === "ISBN" ? (
              <Link
                href={`/search/${identifier.value}?${searchParams.toString()}`}
                onClick={() =>
                  trackBook({
                    identifier,
                    title: book.title,
                    authors: book.authors,
                    publisher: book.publisher,
                    pubDate: book.pubDate,
                    thumbnail: book.thumbnail,
                  })
                }
                className="block rounded-lg transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <BookCard book={book} />
              </Link>
            ) : (
              <BookCard
                book={book}
                trailing={<UnavailableBadge identifier={identifier} />}
              />
            )}
          </li>
        );
      })}

      {isFetchingNextPage ? (
        <ResultRowSkeletons count={NEXT_PAGE_SKELETON_ROWS} />
      ) : null}

      {/*
       * 무한 스크롤 센티넬. 높이를 0으로 두면 intersectionRatio가 0에서 올라가지
       * 않아 훅 기본 threshold(0.5)를 영영 넘기지 못한다 — 그래서 높이를 준다.
       */}
      <li ref={ref} aria-hidden className="h-4 shrink-0" />
    </ul>
  );
}

/**
 * 상세로 갈 수 없는 이유를 로우 오른쪽에 남긴다.
 *
 * 링크를 안 거는 것만으로는 "왜 이 책만 눌러도 반응이 없지?"가 된다. hover 배경이
 * 없는 것과 이 배지가 함께 신호가 된다.
 *
 * ISSN(잡지)과 "식별자를 못 읽음"을 구분하는 이유는 사용자가 할 수 있는 일이 다르기
 * 때문이다 — 잡지는 애초에 이 서비스가 다루지 않는 것이고, 후자는 데이터 문제다.
 * 배지에는 짧은 라벨만 두고 이유는 스크린리더에 싣는다.
 */
function UnavailableBadge({
  identifier,
}: {
  identifier: BookIdentifier | null;
}) {
  const isSerial = identifier?.type === "ISSN";

  return (
    <Badge variant="outline">
      {isSerial ? "잡지" : "정보 없음"}
      <span className="sr-only">
        {isSerial
          ? " · 정기간행물이라 상세 정보를 볼 수 없습니다"
          : " · 식별자가 없어 상세 정보를 볼 수 없습니다"}
      </span>
    </Badge>
  );
}

/**
 * 실제 결과 로우와 같은 `<li>`·같은 여백을 쓴다. 초기 로딩과 다음 페이지 로딩이
 * 같은 마크업을 공유해야 스켈레톤이 결과로 바뀔 때 줄 높이가 튀지 않는다.
 */
function ResultRowSkeletons({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <li key={index} className="flex min-w-0 items-center gap-3 p-2">
          <Skeleton className="h-16 w-11 shrink-0 rounded-[4px]" />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-3.5 w-2/5" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </li>
      ))}
    </>
  );
}
