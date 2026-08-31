"use client";

import { cn } from "@/shared/lib";

import { useActivityCalendar } from "../hooks";
import type { ActivityCalendarProps } from "../types";

import { ActivityCalendarGrid } from "./activity-calendar-grid";
import { ActivityCalendarHeader } from "./activity-calendar-header";

/**
 * 월 단위 활동 캘린더.
 *
 * 상태는 이 컴포넌트가 소유하고 자식에게 props로 내린다. Context를 쓰지
 * 않는 이유는 소비자가 이 컴포넌트 하나뿐이기 때문이다 — Header/Grid를
 * 밖으로 공개해 조립하게 만들 때 다시 검토한다.
 */
export function ActivityCalendar<T>({
  data,
  selectedDate,
  initialDate,
  DayComponent,
  className,
  onDateClick,
  onTodayClick,
}: ActivityCalendarProps<T>) {
  const { calendarState, today, navigateMonth, navigateToToday } =
    useActivityCalendar({
      initialDate,
    });

  const handleTodayClick = () => {
    navigateToToday();
    onTodayClick?.();
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-border p-4 shadow-elevation-1 md:p-6",
        /*
         * 지면은 라이트에서 흰색이다. `bg-card`(#E3F2FD)는 흰 바탕 위
         * primary 약 14%와 같은 색이라, 잔디 램프(1단계가 25%) 안쪽에
         * 들어와 빈 날이 '조금 기록한 날'처럼 보인다. 다크는 지면이
         * 램프의 최저점이라 그 혼동이 없고, ⑥의 계층 규칙상 페이지보다
         * 한 단계 밝은 서피스가 필요하므로 `bg-card`를 유지한다.
         * 카드 경계는 border와 elevation이 맡는다.
         */
        "bg-background dark:bg-card",
        className,
      )}
    >
      <ActivityCalendarHeader
        year={calendarState.year}
        month={calendarState.month}
        onPrevMonth={() => navigateMonth("prev")}
        onNextMonth={() => navigateMonth("next")}
        onTodayClick={handleTodayClick}
      />
      <ActivityCalendarGrid
        daysInMonth={calendarState.daysInMonth}
        firstDayOffset={calendarState.firstDayOffset}
        data={data}
        today={today}
        selectedDate={selectedDate}
        DayComponent={DayComponent}
        onDateClick={onDateClick}
      />
    </div>
  );
}
