"use client";

import { usePathname } from "next/navigation";
import { useEffect, type RefObject } from "react";

const STORAGE_PREFIX = "scroll-position:";

/**
 * App Shell에서는 window가 아니라 main이 스크롤된다.
 * 그래서 Next.js의 기본 스크롤 복원(window 대상)이 적용되지 않으므로 직접 저장/복원한다.
 *
 * 주의: 무한스크롤 목록은 콘텐츠가 다시 로드된 만큼까지만 복원된다.
 */
export function useScrollRestoration(ref: RefObject<HTMLElement | null>) {
  const pathname = usePathname();

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const storageKey = `${STORAGE_PREFIX}${pathname}`;
    const savedPosition = Number(sessionStorage.getItem(storageKey) ?? 0);

    // 첫 페인트 이후에 복원해야 스크롤 가능한 높이가 확보돼 있다
    const restoreFrame = requestAnimationFrame(() => {
      element.scrollTop = savedPosition;
    });

    let saveFrame = 0;
    const handleScroll = () => {
      cancelAnimationFrame(saveFrame);
      saveFrame = requestAnimationFrame(() => {
        sessionStorage.setItem(storageKey, String(element.scrollTop));
      });
    };

    element.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(restoreFrame);
      cancelAnimationFrame(saveFrame);
      element.removeEventListener("scroll", handleScroll);
    };
  }, [pathname, ref]);
}
