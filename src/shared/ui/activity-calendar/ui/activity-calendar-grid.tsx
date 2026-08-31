import { isSameDay } from "date-fns";
import type { ComponentType } from "react";

import { toDateKey } from "@/shared/lib";

import type { ActivityCalendarData, ActivityDayProps } from "../types";

import { ActivityCalendarDay } from "./activity-calendar-day";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;
const DAYS_PER_WEEK = 7;

interface ActivityCalendarGridProps<T> {
  readonly daysInMonth: readonly Date[];
  readonly firstDayOffset: number;
  readonly data?: ActivityCalendarData<T>;
  /** 마운트 전에는 null이다. `useActivityCalendar`의 SSR 대응 참고. */
  readonly today: Date | null;
  readonly selectedDate?: Date | null;
  readonly DayComponent?: ComponentType<ActivityDayProps<T>>;
  readonly onDateClick?: (date: Date) => void;
}

export function ActivityCalendarGrid<T>({
  daysInMonth,
  firstDayOffset,
  data,
  today,
  selectedDate,
  DayComponent,
  onDateClick,
}: ActivityCalendarGridProps<T>) {
  /**
   * 선택 기능을 쓰는 캘린더인지 판별한다.
   *
   * `selectedDate`가 `undefined`면 호출자가 선택을 쓰지 않는 것이고,
   * `null`이면 쓰되 아직 고른 날이 없는 상태다. 둘을 구분해야 읽기 전용
   * 캘린더의 셀이 토글 버튼처럼 보고되지 않는다.
   */
  const selectionEnabled = selectedDate !== undefined;

  /** 마지막 주가 어긋나지 않도록 뒤쪽 빈 칸도 채운다. */
  const trailingCount =
    (DAYS_PER_WEEK - ((firstDayOffset + daysInMonth.length) % DAYS_PER_WEEK)) %
    DAYS_PER_WEEK;

  return (
    <div className="mt-4 grid grid-cols-7 gap-1">
      {WEEKDAYS.map((label) => (
        <div
          key={label}
          className="pb-1 text-center text-xs leading-[1.4] font-medium text-muted-foreground"
        >
          {label}
        </div>
      ))}

      {Array.from({ length: firstDayOffset }, (_, index) => (
        <div key={`leading-${index}`} aria-hidden="true" />
      ))}

      {daysInMonth.map((date) => {
        const dateKey = toDateKey(date);

        return (
          <ActivityCalendarDay
            key={dateKey}
            date={date}
            data={data?.[dateKey]}
            dayNumber={date.getDate()}
            isToday={today ? isSameDay(date, today) : false}
            isSelected={selectedDate ? isSameDay(date, selectedDate) : false}
            DayComponent={DayComponent}
            selectionEnabled={selectionEnabled}
            onDateClick={onDateClick}
          />
        );
      })}

      {Array.from({ length: trailingCount }, (_, index) => (
        <div key={`trailing-${index}`} aria-hidden="true" />
      ))}
    </div>
  );
}
