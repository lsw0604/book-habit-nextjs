import type { ComponentType } from "react";

import { cn } from "@/shared/lib";

import type { ActivityDayProps } from "../types";

import { ActivityDay } from "./day-components";

interface DayShellProps<T> extends ActivityDayProps<T> {
  readonly DayComponent?: ComponentType<ActivityDayProps<T>>;
  /**
   * 선택 기능을 쓰는 캘린더인지. 안 쓰는 화면에서 모든 셀이
   * `aria-pressed="false"`(눌리지 않은 토글)로 보고되는 것을 막는다.
   */
  readonly selectionEnabled: boolean;
  readonly onDateClick?: (date: Date) => void;
}

/**
 * 날짜 셀의 겉껍데기.
 *
 * 클릭·포커스·접근성만 소유하고 시각적 결정은 하지 않는다. 배경·비율·날짜
 * 숫자 배치는 전부 `DayComponent`가 정한다 — 그래야 잔디처럼 셀을 가득
 * 칠하거나 책 표지로 채우는 것이 가능하다.
 *
 * `onDateClick`이 없으면 읽기 전용 캘린더이므로 버튼으로 만들지 않는다.
 * 아무 일도 하지 않는 포커스 대상이 한 달치 늘어나기 때문이다. 대신
 * `role="img"`로 셀을 하나의 그림처럼 묶어, 잔디처럼 색으로만 정보를 주는
 * 경우에도 기록 개수가 읽히게 한다.
 */
export function ActivityCalendarDay<T>({
  DayComponent = ActivityDay,
  selectionEnabled,
  onDateClick,
  ...dayProps
}: DayShellProps<T>) {
  const { date, data, isToday, isSelected } = dayProps;
  const count = data?.length ?? 0;

  /** 잔디는 색으로만 정보를 주므로 개수를 라벨에 실어 보낸다. */
  const label = `${date.getMonth() + 1}월 ${date.getDate()}일, 기록 ${count}개`;

  if (!onDateClick) {
    return (
      <div role="img" aria-label={isToday ? `${label} (오늘)` : label}>
        <DayComponent {...dayProps} />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onDateClick(date)}
      aria-label={label}
      aria-current={isToday ? "date" : undefined}
      aria-pressed={selectionEnabled ? isSelected : undefined}
      className={cn(
        "rounded-lg outline-none",
        "focus-visible:ring-3 focus-visible:ring-ring/20",
      )}
    >
      <DayComponent {...dayProps} />
    </button>
  );
}
