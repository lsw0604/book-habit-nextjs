"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { setLastMainPath } from "@/shared/lib";

/** (main) 그룹의 경로 변화를 매번 세션에 기록해, (auth) 화면의 뒤로가기가 참조할 수 있게 한다. */
export function useTrackLastMainPath() {
  const pathname = usePathname();

  useEffect(() => {
    setLastMainPath(pathname);
  }, [pathname]);
}
