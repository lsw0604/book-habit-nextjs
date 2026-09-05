import type { ComponentProps } from "react";

import { cn } from "../lib";

interface ProgressProps extends Omit<ComponentProps<"div">, "children"> {
  /** 0~100. 범위를 벗어난 값은 잘라낸다. */
  value: number;
  /** 스크린리더용 설명. 진행 바만으로는 무엇의 진행인지 알 수 없다. */
  label?: string;
}

/**
 * 진행률 바. DESIGN.md ④ 신규 컴포넌트 파생 규칙으로 조합했다 —
 * 물러나는 구획은 `bg-muted`, 채움은 `primary` 계열, radius는 `rounded-full`.
 *
 * 값이 "없음"인 경우(총 페이지를 모르는 책 등)는 0으로 그리지 말고 호출부에서
 * 아예 렌더하지 않는다. 빈 바는 "0% 읽음"으로 읽혀 거짓말이 된다.
 */
export function Progress({ value, label, className, ...props }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn(
        "h-1 w-full overflow-hidden rounded-full bg-muted",
        className,
      )}
      {...props}
    >
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-150 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
