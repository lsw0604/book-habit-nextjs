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
         * ⑥의 계층 규칙상 다크는 그림자만으론 계층이 안 드러나 bg-card로
         * 서피스를 한 단계 밝혀야 하지만, 라이트는 흰 배경 위 elevation
         * shadow만으로 충분하다. 카드 경계는 border와 elevation이 맡는다.
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
