"use client";

import { AlertTriangleIcon, RotateCcwIcon } from "lucide-react";
import { useEffect } from "react";

import { Button, EmptyState } from "@/shared/ui";

interface MainErrorProps {
  error: Error & { digest?: string };
  /**
   * 세그먼트를 다시 렌더한다. Next 15까지 `reset`이던 prop이 16에서 이 이름으로
   * 바뀌었다 — `next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md`.
   */
  retry: () => void;
}

/**
 * `(main)` 그룹의 Error Boundary. 앱 셸은 남기고 본문만 대체한다 —
 * 헤더·내비게이션이 살아 있어야 사용자가 막힌 화면에서 빠져나갈 수 있다.
 *
 * TanStack Query의 조회 실패는 여기까지 오지 않는다. `throwOnError` 기본값이
 * false라 `isError` 상태로 반환되고 각 화면이 자체 `EmptyState`로 처리한다.
 * 그래서 이 경계가 실제로 잡는 건 **예상하지 못한 렌더 버그**다.
 *
 * 같은 세그먼트의 `layout.tsx`에서 난 에러는 잡지 못한다(Next.js 규약).
 * 그건 상위 경계의 몫이다.
 */
export default function MainError({ error, retry }: MainErrorProps) {
  useEffect(() => {
    // 프로덕션에서 서버 에러의 원문은 클라이언트로 오지 않는다. digest만 남는다.
    console.error(error);
  }, [error]);

  return (
    <EmptyState
      variant="error"
      icon={AlertTriangleIcon}
      title="문제가 발생했어요"
      description="화면을 그리는 중 오류가 생겼습니다. 잠시 후 다시 시도해 주세요."
    >
      <Button variant="ghost" size="sm" onClick={() => retry()}>
        <RotateCcwIcon />
        다시 시도
      </Button>
    </EmptyState>
  );
}
