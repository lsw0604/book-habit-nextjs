"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  getDay,
  getMonth,
  getYear,
  isValid,
  parseISO,
  startOfDay,
  startOfMonth,
  subMonths,
} from "date-fns";
import { useCallback, useMemo, useState, useSyncExternalStore } from "react";

interface UseActivityCalendarOptions {
  initialDate?: string | Date;
}

/**
 * 문자열/Date를 Date로 정규화한다. 파싱에 실패하면 null.
 *
 * 'yyyy-MM-dd'와 ISO 8601을 따로 다루지 않는다. `parseISO('2026-08-30')`은
 * 로컬 자정을 돌려주므로 `parse(s, 'yyyy-MM-dd', ...)`와 결과가 같다.
 */
function toDate(value: string | Date): Date | null {
  const parsed =
    typeof value === "string" ? parseISO(value) : new Date(value.getTime());
  return isValid(parsed) ? parsed : null;
}

const noopSubscribe = () => () => {};

/**
 * 자정 기준 타임스탬프.
 *
 * `useSyncExternalStore`는 렌더마다 스냅샷을 읽어 `Object.is`로 비교하므로,
 * 하루 동안 같은 값이 나와야 무한 루프에 빠지지 않는다.
 *
 * 구독(`noopSubscribe`)이 아무것도 알려주지 않으므로 **자정이 지나도 스스로
 * 갱신되지는 않는다.** 다른 이유로 리렌더가 일어날 때 비로소 새 값을 읽는다.
 * 자정을 넘겨 열어둔 화면에서 오늘 표시를 갱신하려면 타이머로 구독을
 * 구현해야 한다.
 */
const getTodaySnapshot = () => startOfDay(new Date()).getTime();

/** 서버 스냅샷은 항상 null이라 하이드레이션 불일치가 없다. */
const getServerTodaySnapshot = (): number | null => null;

export function useActivityCalendar({
  initialDate,
}: UseActivityCalendarOptions = {}) {
  /**
   * '오늘'은 클라이언트에서만 확정한다.
   *
   * Next.js는 "use client" 컴포넌트도 서버에서 프리렌더한다. 서버 타임존(보통
   * UTC)과 브라우저 타임존(예: Asia/Seoul, +9)이 다르면 하루가 어긋난다.
   * 서버·클라이언트 첫 렌더가 똑같이 null이면 그 창구가 닫히고, 오늘 표시는
   * 하이드레이션 직후에 붙는다. `login-form.tsx`가 쓰는 방식과 같다.
   */
  const todayMs = useSyncExternalStore(
    noopSubscribe,
    getTodaySnapshot,
    getServerTodaySnapshot,
  );
  const today = useMemo(
    () => (todayMs === null ? null : new Date(todayMs)),
    [todayMs],
  );

  /**
   * 표시 중인 달.
   *
   * ⚠️ `initialDate`를 주지 않으면 이 값이 서버 타임존 기준으로 정해진다.
   * 월 경계에서 서버와 클라이언트의 달이 갈릴 수 있다(UTC 서버 + KST 기준
   * 매월 말 9시간). React가 하이드레이션 후 클라이언트 값으로 교정하므로
   * 최종 화면은 옳지만 경고가 남는다. 서버 렌더되는 화면에 쓸 때는
   * `initialDate`를 넘겨 달을 고정하는 편이 안전하다.
   */
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    const parsed = initialDate ? toDate(initialDate) : null;
    return parsed ?? new Date();
  });

  const calendarState = useMemo(() => {
    const monthStart = startOfMonth(currentDate);

    return {
      year: getYear(currentDate),
      /** 1~12. date-fns의 getMonth는 0부터 시작한다. */
      month: getMonth(currentDate) + 1,
      /** 1일의 요일(0=일). 그리드 앞쪽 빈 칸 수와 같다. */
      firstDayOffset: getDay(monthStart),
      daysInMonth: eachDayOfInterval({
        start: monthStart,
        end: endOfMonth(currentDate),
      }),
    };
  }, [currentDate]);

  const navigateMonth = useCallback((direction: "prev" | "next") => {
    setCurrentDate((prev) =>
      direction === "prev" ? subMonths(prev, 1) : addMonths(prev, 1),
    );
  }, []);

  const navigateToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  return useMemo(
    () => ({ calendarState, today, navigateMonth, navigateToToday }),
    [calendarState, today, navigateMonth, navigateToToday],
  );
}
