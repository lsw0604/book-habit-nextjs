"use client";

import { useRef, type ReactNode } from "react";

import { useScrollRestoration } from "./useScrollRestoration";
import { useTrackLastMainPath } from "./useTrackLastMainPath";

import { BottomNav, Header, Sidebar } from "@/widgets/navigation";
/**
 * 애플리케이션 셸.
 *
 * 헤더·바텀네비를 문서 흐름 안에 두고 뷰포트 높이를 셋이 나눠 갖는다.
 * 그 결과 main이 '확정된 높이'를 갖게 되어, 내부 스크롤이 필요한 화면(칸반 등)이
 * 별도의 높이 계산 없이 h-full / flex-1 만으로 동작한다.
 *
 * md 이상은 바텀네비 대신 좌측 사이드바(md~lg 아이콘만, lg~ 라벨 포함)로
 * 내비게이션이 옮겨간다. DESIGN.md ⑧ 반응형 정책.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const mainRef = useRef<HTMLElement>(null);

  useScrollRestoration(mainRef);
  useTrackLastMainPath();

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <Header />
      <div className="flex min-h-0 min-w-0 flex-1">
        <Sidebar />
        <main
          ref={mainRef}
          className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto no-scrollbar"
        >
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
