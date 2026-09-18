import { AlertTriangleIcon, RotateCcwIcon } from "lucide-react";
import type { ReactNode } from "react";

import type { APIError } from "@/shared/api";

import { Button } from "./button";
import { EmptyState } from "./empty-state";

interface QueryStateProps {
  isPending: boolean;
  /** 호출부가 `isError || !data`처럼 데이터 부재까지 합쳐 넘긴다. */
  isError: boolean;
  error?: APIError | null;
  onRetry: () => void;
  /** "책 정보를 불러오지 못했어요"처럼 화면마다 다른 대상 명사만 바뀐다. */
  errorTitle: string;
  /** 실물과 같은 태그·여백을 쓴 스켈레톤(DESIGN.md ⑦). 화면마다 모양이 달라 호출부가 만든다. */
  skeleton: ReactNode;
  children: ReactNode;
}

/**
 * 상세 화면의 `isPending`/`isError` 분기 shell. `entities/book`과
 * `entities/my-book` 상세 화면 둘 다 이 분기가 문구만 다르고 완전히 같아서
 * 여기(shared/ui)로 하향 이관했다 — 조회 상태를 Skeleton/EmptyState로
 * 갈아끼우는 건 책 도메인과 무관한 범용 패턴이다(docs/architecture.md 골든룰 3).
 *
 * 스켈레톤·실제 내용(children)은 화면마다 다르므로 여기서 만들지 않고 그대로
 * 받는다 — 이 컴포넌트가 아는 건 "언제 무엇을 보여줄지"뿐이다.
 */
export function QueryState({
  isPending,
  isError,
  error,
  onRetry,
  errorTitle,
  skeleton,
  children,
}: QueryStateProps) {
  if (isPending) return skeleton;

  if (isError) {
    return (
      <EmptyState
        variant="error"
        icon={AlertTriangleIcon}
        title={errorTitle}
        description={error?.userMessage ?? "잠시 후 다시 시도해 주세요."}
      >
        <Button variant="ghost" size="sm" onClick={onRetry}>
          <RotateCcwIcon />
          다시 시도
        </Button>
      </EmptyState>
    );
  }

  return children;
}
