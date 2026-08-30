"use client";

import { useRef, type ReactNode } from "react";

import { useScrollRestoration } from "./useScrollRestoration";
import { useTrackLastMainPath } from "./useTrackLastMainPath";
/**
 * 애플리케이션 셸.
 *
 * 헤더·바텀네비를 문서 흐름 안에 두고 뷰포트 높이를 셋이 나눠 갖는다.
 * 그 결과 main이 '확정된 높이'를 갖게 되어, 내부 스크롤이 필요한 화면(칸반 등)이
 * 별도의 높이 계산 없이 h-full / flex-1 만으로 동작한다.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const mainRef = useRef<HTMLElement>(null);

  useScrollRestoration(mainRef);
  useTrackLastMainPath();

  return (
    <>
      <div className="flex h-dvh flex-col overflow-hidden">
        <main
          ref={mainRef}
          className="flex min-h-0 flex-1 flex-col overflow-y-auto no-scrollbar"
        >
          {children}
        </main>
      </div>
    </>
  );
}
