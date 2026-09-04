"use client";

import {
  AlertTriangleIcon,
  RotateCcwIcon,
  SearchIcon,
  SearchXIcon,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { BookCard } from "@/entities/book";
import { useInfiniteScroll, useQueryParams } from "@/shared/hooks";
import { cn } from "@/shared/lib";
import { Button, EmptyState, Skeleton } from "@/shared/ui";

import { useSearchBook } from "../hooks";
import { DEFAULT_SEARCH_BOOK_PARAMS, searchBookParamsSchema } from "../model";

const INITIAL_SKELETON_ROWS = 4;
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

  // 검색어가 없는 상태를 isPending보다 **먼저** 거른다. useSearchBook이
  // `enabled: Boolean(params.query)`로 쿼리를 멈춰두는데, 멈춘 쿼리는
  // isPending이 true로 남는다. 순서를 바꾸면 검색 전 화면에 스켈레톤이 영원히 돈다.
  if (!params.query) {
    return (
      <EmptyState
        icon={SearchIcon}
        title="책을 검색해 보세요"
        description="제목·저자·출판사·ISBN으로 찾을 수 있어요. 필터에서 검색 대상과 정렬을 바꿀 수 있습니다."
      />
    );
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
      {data.map((book, index) => (
        <li key={book.isbn || `${book.title}-${index}`} className="min-w-0">
          {book.isbn ? (
            <Link
              href={`/search/${book.isbn}?${searchParams.toString()}`}
              className="block rounded-lg transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <BookCard book={book} />
            </Link>
          ) : (
            <BookCard book={book} />
          )}
        </li>
      ))}

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
