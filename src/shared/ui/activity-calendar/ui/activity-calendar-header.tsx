import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "../../button";

interface ActivityCalendarHeaderProps {
  readonly year: number;
  readonly month: number;
  readonly onPrevMonth: () => void;
  readonly onNextMonth: () => void;
  readonly onTodayClick: () => void;
}

/**
 * 제목과 내비게이션 두 덩어리로 나눈다. `justify-between`에 자식을 넷 두면
 * 제목이 가운데 오지 않고 4등분된다.
 */
export function ActivityCalendarHeader({
  year,
  month,
  onPrevMonth,
  onNextMonth,
  onTodayClick,
}: ActivityCalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h2 className="text-xl leading-[1.3] font-bold tracking-[-0.01em] text-title md:text-2xl">
        {year}년 {month}월
      </h2>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrevMonth}
          aria-label="이전 달"
        >
          <ChevronLeftIcon className="size-5" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onTodayClick}>
          오늘
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onNextMonth}
          aria-label="다음 달"
        >
          <ChevronRightIcon className="size-5" />
        </Button>
      </div>
    </div>
  );
}
