"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { cn } from "@/shared/lib";

import { SearchView } from "./search-view";

/** 목록만 보이는 경로. 이보다 깊어지면(`/search/[isbn]`) 상세가 열린 것으로 본다. */
const SEARCH_LIST_PATH = "/search";

interface SearchListDetailViewProps {
  children: ReactNode;
}

/**
 * 검색 화면의 list-detail 레이아웃.
 *
 * lg 이상: 왼쪽 목록 + 오른쪽 상세를 나란히 보여준다.
 * lg 미만: 한 번에 하나만 — 책을 고르기 전엔 목록이 전체 폭, 고르면 상세가 전체 폭.
 *
 * 두 패널을 항상 마운트해두고 CSS로만 토글한다. 그래야 상세로 이동해도 목록의
 * 검색 상태(스크롤·쿼리 캐시)가 살아남는다(Sidebar/BottomNav와 같은 패턴).
 */
export function SearchListDetailView({ children }: SearchListDetailViewProps) {
  const pathname = usePathname();
  const isDetailOpen = pathname !== SEARCH_LIST_PATH;

  return (
    /*
     * 두 패널 모두 `min-h-0`이 필수다. flex 자식의 `min-height` 기본값은 `auto`(콘텐츠
     * 크기)이고 그게 `h-full`을 이긴다 — 없으면 목록이 길어질수록 패널이 그만큼 늘어나
     * 앱 셸의 `main`까지 스크롤된다. 스크롤은 안쪽 컨테이너에서만 일어나야 한다.
     */
    <div className="flex h-full min-h-0 min-w-0 flex-col lg:flex-row">
      <div
        className={cn(
          "h-full min-h-0 min-w-0 flex-col lg:flex lg:w-96 lg:shrink-0 lg:border-r lg:border-border",
          isDetailOpen ? "hidden lg:flex" : "flex",
        )}
      >
        <SearchView />
      </div>
      <div
        className={cn(
          "h-full min-h-0 min-w-0 flex-1 overflow-y-auto lg:flex",
          isDetailOpen ? "flex" : "hidden lg:flex",
        )}
      >
        {children}
      </div>
    </div>
  );
}
