import { Suspense } from "react";

import { SearchBookForm, SearchBookList } from "@/features/search-book";
import { Skeleton } from "@/shared/ui";

/**
 * 검색 목록 화면. master-detail의 왼쪽 패널이자, lg 미만에서는 단독 화면이다.
 *
 * `Suspense`는 `useSearchParams`를 쓰는 자식에만 건다. 화면 전체를 감싸면
 * 정적인 헤더까지 함께 지연되어, 서스펜드되는 동안 아무것도 보이지 않는다.
 */
export function SearchView() {
  return (
    // min-h-0: 목록 영역이 부모보다 커지지 않게 한다(min-height:auto가 h-full을 이긴다).
    <div className="flex h-full min-h-0 min-w-0 flex-col">
      <div className="flex shrink-0 flex-col gap-4 border-b border-border p-4 md:p-6">
        <h1 className="text-[1.75rem] leading-tight font-bold tracking-[-0.01em] text-title md:text-[2rem]">
          책 검색
        </h1>

        <Suspense fallback={<SearchBookFormFallback />}>
          <SearchBookForm />
        </Suspense>
      </div>

      {/*
       * 리스트에는 fallback을 두지 않는다. 마운트되는 즉시 자체 스켈레톤이나
       * 안내 화면을 그리므로, 여기서 또 하나를 끼우면 전환만 한 번 늘어난다.
       */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <Suspense fallback={null}>
          <SearchBookList />
        </Suspense>
      </div>
    </div>
  );
}

/** 검색 폼과 같은 높이를 잡아둔다. 필터 버튼(44px) + 인풋, 그 아래 필터 요약 배지 줄. */
function SearchBookFormFallback() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-4">
        <Skeleton className="size-11 shrink-0 rounded-lg" />
        <Skeleton className="h-11 flex-1 rounded-lg md:max-w-md" />
      </div>
      <Skeleton className="h-6 w-40 rounded-full" />
    </div>
  );
}
