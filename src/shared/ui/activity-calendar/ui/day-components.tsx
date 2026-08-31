import { getDay } from "date-fns";

import { cn } from "@/shared/lib";

import type { ActivityDayProps } from "../types";

/**
 * 셀 좌측 상단의 날짜 숫자.
 *
 * 위치를 여기 한 곳에 모아두는 이유는, 셀마다 콘텐츠가 달라도 날짜만은 같은
 * 자리에 있어야 한 달을 훑어볼 수 있기 때문이다. 커스텀 `DayComponent`를
 * 만들 때도 이걸 쓰면 기본 셀들과 정렬이 맞는다.
 *
 * 색은 지정하지 않고 부모에서 상속받는다. 잔디처럼 배경이 진해지는 셀은
 * 부모가 `text-primary-foreground`로 뒤집기 때문이다.
 */
export function ActivityDayNumber({
  dayNumber,
  className,
}: {
  readonly dayNumber: number;
  readonly className?: string;
}) {
  return (
    <span
      className={cn(
        "absolute top-1 left-1 text-xs leading-[1.4] font-medium",
        className,
      )}
    >
      {dayNumber}
    </span>
  );
}

/**
 * `DayComponent`를 넘기지 않았을 때 쓰이는 기본 셀. 날짜 숫자만 보여준다.
 *
 * DESIGN.md에 요일 색 규정이 없어 주말은 `text-muted-foreground`로 물러나게
 * 했다. 한국 달력 관행(일=빨강)을 쓰려면 상태색을 장식에 쓰는 것이라
 * ⑦의 예외 조항이 필요하다.
 */
export function ActivityDay<T>({
  date,
  dayNumber,
  isToday,
  isSelected,
}: ActivityDayProps<T>) {
  const dayOfWeek = getDay(date);
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  return (
    <div
      className={cn(
        "relative aspect-square rounded-lg transition-colors",
        isSelected && "bg-primary text-primary-foreground",
        !isSelected && isToday && "bg-muted text-foreground",
        !isSelected && !isToday && isWeekend && "text-muted-foreground",
        !isSelected && !isToday && !isWeekend && "text-foreground",
      )}
    >
      <ActivityDayNumber dayNumber={dayNumber} />
    </div>
  );
}

/**
 * 잔디 — 하루의 기록 개수(`data.length`)를 5단계 음영으로 보여준다.
 *
 * 색은 `primary` 계열의 불투명도 램프를 쓴다. Success/Warning/Danger는 상태
 * 표시 전용이고 장식·강조에 쓰지 않는 것이 DESIGN.md ⑦의 규정이라, 강조는
 * primary로 가져간다. 색만으로 정보를 전달하지 않도록 개수는 셀 버튼의
 * `aria-label`에 함께 실린다(`ActivityCalendarDay` 참고).
 */
const HEATMAP_LEVELS = [
  "bg-muted",
  "bg-primary/25",
  "bg-primary/50",
  "bg-primary/75",
  "bg-primary",
] as const;

/** 이 단계부터 배경이 충분히 진해져 반전 텍스트가 필요하다. */
const INVERTED_TEXT_FROM = 3;

export function ActivityHeatmapDay<T>({
  data,
  dayNumber,
  isToday,
  isSelected,
}: ActivityDayProps<T>) {
  const count = data?.length ?? 0;
  const level = Math.min(count, HEATMAP_LEVELS.length - 1);

  return (
    <div
      className={cn(
        "relative aspect-square rounded-lg transition-colors",
        HEATMAP_LEVELS[level],
        level >= INVERTED_TEXT_FROM
          ? "text-primary-foreground"
          : "text-foreground",
        isToday && !isSelected && "ring-1 ring-primary",
        isSelected && "ring-2 ring-ring",
      )}
    >
      <ActivityDayNumber dayNumber={dayNumber} />
    </div>
  );
}

/**
 * 점 — 하루의 기록 개수를 점 개수로 보여준다.
 *
 * 잔디(`ActivityHeatmapDay`)와 같은 정보를 다른 방식으로 인코딩한다. 셀을
 * 칠하지 않으므로 지면이 흰색 그대로 남고, 날짜 숫자도 반전 없이 읽힌다.
 * 대신 사람이 한눈에 셀 수 있는 개수에 한계가 있어(대략 4개) 3개에서
 * 자른다 — 정확한 개수는 셀의 `aria-label`에 실린다.
 *
 * 선택 표시가 채우기가 아니라 링인 이유: 셀을 `bg-primary`로 채우면 같은
 * 색인 점이 사라진다.
 */
const MAX_DOTS = 3;

export function ActivityDotDay<T>({
  data,
  dayNumber,
  isToday,
  isSelected,
}: ActivityDayProps<T>) {
  const count = data?.length ?? 0;
  const dotCount = Math.min(count, MAX_DOTS);

  return (
    <div
      className={cn(
        "relative aspect-square rounded-lg transition-colors",
        isToday && !isSelected && "bg-muted",
        isSelected && "ring-2 ring-ring",
      )}
    >
      <ActivityDayNumber
        dayNumber={dayNumber}
        className={isToday ? "text-foreground" : "text-muted-foreground"}
      />
      <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-1">
        {Array.from({ length: dotCount }, (_, index) => (
          <span
            key={index}
            className="size-1.5 shrink-0 rounded-full bg-primary"
          />
        ))}
      </div>
    </div>
  );
}
