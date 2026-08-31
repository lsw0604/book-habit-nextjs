import type { ComponentType } from "react";

/**
 * 캘린더에 표시될 활동 데이터.
 *
 * 키는 **반드시 `shared/lib`의 `toDateKey()`로 만든다**(로컬 시각 기준
 * 'yyyy-MM-dd'). 평평한 배열이 있다면 `groupItemsByDate()`가 이 형태로 묶어주며,
 * 그 반환값(`GroupType<T>`)은 이 타입에 그대로 할당된다.
 *
 * @example
 * ```ts
 * const records: ActivityCalendarData<ReadingLog> = {
 *   "2026-08-30": [{ id: 1, pages: 40 }],
 *   "2026-08-31": [{ id: 2, pages: 12 }, { id: 3, pages: 30 }],
 * };
 * ```
 */
export interface ActivityCalendarData<T> {
  readonly [dateKey: string]: readonly T[];
}

/**
 * 날짜 셀 **내부 전체**를 그리는 컴포넌트가 받는 props.
 *
 * 배경·비율·날짜 숫자 배치까지 전부 이 컴포넌트가 소유한다. 바깥 `<button>`은
 * 클릭·포커스·접근성만 담당하고 시각적 결정을 하지 않는다. 그래서 잔디(활동량
 * 음영)처럼 셀을 가득 칠하는 것도, 책 표지처럼 셀을 이미지로 채우는 것도
 * 같은 자리에서 만들 수 있다.
 *
 * `isToday`·`isSelected`는 여기서만 알 수 있으므로 반드시 전달한다
 * (`isToday`는 SSR 안전을 위해 마운트 이후에야 true가 된다 — `useActivityCalendar` 참고).
 */
export interface ActivityDayProps<T> {
  readonly date: Date;
  readonly data?: readonly T[];
  readonly dayNumber: number;
  readonly isToday: boolean;
  readonly isSelected: boolean;
}

export interface ActivityCalendarProps<T> {
  readonly data?: ActivityCalendarData<T>;
  /**
   * 선택된 날. 생략하면 선택 기능을 쓰지 않는 것으로 보고 셀이 토글로
   * 보고되지 않는다. 쓰되 고른 날이 없을 때는 `null`을 넘긴다.
   */
  readonly selectedDate?: Date | null;
  /** 처음 표시할 달. 'yyyy-MM-dd' 문자열 또는 Date. 이후 변경은 반영되지 않는다. */
  readonly initialDate?: string | Date;
  /** 날짜 셀 내부를 그리는 컴포넌트. 없으면 날짜 숫자만 표시한다. */
  readonly DayComponent?: ComponentType<ActivityDayProps<T>>;
  readonly className?: string;
  readonly onDateClick?: (date: Date) => void;
  readonly onTodayClick?: () => void;
}
