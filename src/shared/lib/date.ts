import {
  format,
  formatDuration,
  isValid,
  parseISO,
  formatDistanceToNow,
} from "date-fns";
import { ko } from "date-fns/locale";

const DATE_FORMATS = {
  short: "yyyy-MM-dd",
  medium: "yyyy년 MM월 dd일",
  long: "yyyy년 MM월 dd일 eeee",
  datetime: "yyyy-MM-dd HH:mm",
  monthDay: "MM월 dd일",
  time: "HH:mm",
  datetimeWithSeconds: "yyyy-MM-dd HH:mm:ss",
  yearMonth: "yyyy년 MM월",
  full: "yyyy년 MM월 dd일 eeee a h:mm",
  relative: "relative",
} as const;

type DateFormatKey = keyof typeof DATE_FORMATS;

/** 날짜 문자열을 키로 아이템 배열을 담는 그룹. `groupItemsByDate`의 반환 타입. */
export interface GroupType<T> {
  [date: string]: T[];
}

interface DurationPart {
  value: string;
  unit: "시간" | "분";
}

/**
 * 문자열 또는 Date 객체를 정규화된 Date 객체로 변환합니다.
 *
 * @param date - ISO 문자열 또는 Date 객체
 * @returns 정규화된 Date 객체
 *
 * @example
 * ```typescript
 * normalizedDate('2024-03-15T14:30:00Z') // Date 객체 반환
 * normalizedDate(new Date()) // 그대로 반환
 * ```
 */
export const normalizedDate = (date: string | Date): Date => {
  let parsedDate: Date;
  if (typeof date === "string") {
    parsedDate = parseISO(date);
  } else {
    parsedDate = date;
  }

  if (isNaN(parsedDate.getTime())) {
    return new Date();
  }

  return parsedDate;
};

/**
 * 날짜를 사전에 정의된 형식의 문자열로 변환합니다.
 *
 * @param date - 포맷팅할 날짜 (ISO 8601 문자열 또는 Date 객체).
 * @param preset - 사용할 포맷 프리셋 키. ('short', 'medium', 'long', 'datetime', 'monthDay', 'time')
 * @returns 포맷팅된 날짜 문자열. 날짜가 유효하지 않은 경우 'Invalid Date'를 반환합니다.
 * @see {@link DATE_FORMATS} - 사용 가능한 프리셋 종류 확인
 *
 * @example
 * ```typescript
 * const myDate = '2025-09-08T14:30:00';
 *
 * formatDate(myDate, 'short')    // '2025-09-08'
 * formatDate(myDate, 'medium)    // '2025년 09월 08일'
 * formatDate(myDate, 'long')     // '2025년 09월 08일 월요일'
 * formatDate(myDate, 'time')     // '14:30'
 * formatDate(myDate, 'full')     // '2025년 09월 08일 월요일 오후 2:30'
 * formatDate(myDate, 'monthDay') // '09월 08일'
 * formatDate(myDate, 'yearMonth')// '2025년 09월'
 * formatDate(myDate, 'datetime') // '2025-09-08 14:30'
 * formatDate(myDate, 'relative') // '5분 전, 어제, 2개월 전'
 * formatDate(myDate, 'datetimeWithSeconds') // 2025-09-08 14:30:00
 * formatDate('invalid-date', 'short') // 'Invalid Date'
 * ```
 */
export const formatDate = (
  date: string | Date,
  dateFormatKey: DateFormatKey,
): string => {
  try {
    const dateObj = normalizedDate(date);

    if (!isValid(dateObj)) {
      console.warn("Invalid date");
      return "유효하지 않은 날짜 형식입니다.";
    }

    if (dateFormatKey === "relative") {
      return formatDistanceToNow(dateObj, {
        addSuffix: true, // '전', '후'와 같은 접미사 추가
        locale: ko,
      });
    }

    return format(dateObj, DATE_FORMATS[dateFormatKey], { locale: ko });
  } catch (error) {
    console.error("Date formatting error:", error);
    return "날짜 변환 오류";
  }
};

/**
 * 날짜별 그룹의 키를 만듭니다. **로컬 시각 기준** 'yyyy-MM-dd'입니다.
 *
 * ⚠️ `date.toISOString().slice(0, 10)`으로 키를 만들면 안 됩니다. 그건 UTC
 * 기준이라 KST(+9)에서는 하루 중 9시간이 전날로 밀립니다. 사용자가 1월 3일
 * 00:00(KST)에 남긴 기록은 UTC로 1월 2일이라 2일 칸에 붙어버립니다.
 *
 * `ActivityCalendar`가 셀을 찾을 때도 이 함수를 씁니다. 키를 만드는 쪽과
 * 찾는 쪽이 갈라지면 데이터가 예외 없이 조용히 사라지므로, 키는 반드시
 * 이 함수를 거쳐 만듭니다.
 */
export const toDateKey = (date: Date | number): string =>
  format(date, DATE_FORMATS.short);

/**
 * `date` 속성을 가진 객체들의 배열을 날짜별로 그룹화합니다.
 * 키는 `toDateKey`가 만드는 로컬 기준 'yyyy-MM-dd' 문자열입니다.
 *
 * 반환 타입은 `ActivityCalendar`의 `data` prop(`ActivityCalendarData<T>`)에 그대로
 * 넘길 수 있습니다.
 *
 * @template T - 배열의 아이템 타입. `date`라는 이름의 Date 속성을 가져야 합니다.
 * @param items - 그룹화할 배열. 생략하거나 undefined면 빈 객체를 반환합니다.
 * @returns 날짜 문자열을 키로, 그 날의 아이템 배열을 값으로 갖는 객체.
 *
 * @example
 * ```typescript
 * // 입력 시각은 전부 UTC지만, 키는 로컬(KST) 기준으로 만들어집니다.
 * const data = [
 *   { id: 1, value: 'a', date: new Date('2024-01-01T10:00:00Z') }, // KST 1/1 19:00
 *   { id: 2, value: 'b', date: new Date('2024-01-01T12:00:00Z') }, // KST 1/1 21:00
 *   { id: 3, value: 'c', date: new Date('2024-01-02T15:00:00Z') }, // KST 1/3 00:00 ← 날짜가 넘어감
 * ];
 *
 * groupItemsByDate(data);
 * // {
 * //   '2024-01-01': [{ id: 1, ... }, { id: 2, ... }],
 * //   '2024-01-03': [{ id: 3, ... }],
 * // }
 * ```
 */
export function groupItemsByDate<T extends { date: Date }>(
  items: readonly T[] = [],
): GroupType<T> {
  return items.reduce<GroupType<T>>((acc, item) => {
    const dateKey = toDateKey(item.date);

    (acc[dateKey] ??= []).push(item);

    return acc;
  }, {});
}

/**
 * 숫자 형태의 총 분(minutes)을 'X시간 Y분' 형식의 문자열로 변환합니다.
 * 0인 단위(시간 또는 분)는 결과 문자열에서 생략됩니다.
 *
 * @param totalMinutes - 변환할 총 시간(분). `null` 또는 `undefined`도 안전하게 처리됩니다.
 * @returns 'X시간 Y분' 또는 'Y분' 등으로 포맷팅된 문자열. `0` 또는 `null` 입력 시 '0분'을 반환합니다.
 *
 * @example
 * ```typescript
 * formatDurationFromMinutes(95)   // '1시간 35분'
 * formatDurationFromMinutes(120)  // '2시간'
 * formatDurationFromMinutes(50)   // '50분'
 * formatDurationFromMinutes(0)    // '0분'
 * formatDurationFromMinutes(null) // '0분'
 * ```
 */
export const formatMinutes = (totalMinutes: number): string => {
  if (totalMinutes === 0 || totalMinutes === null) return "0분";

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const duration = {
    hours,
    minutes,
  };

  return formatDuration(duration, { locale: ko, format: ["hours", "minutes"] });
};

export const formatMinutesToParts = (
  totalMinutes: number | null | undefined,
): DurationPart[] => {
  if (totalMinutes == null || totalMinutes <= 0) {
    return [{ value: "0", unit: "분" }];
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const parts: DurationPart[] = [];

  if (hours > 0) {
    parts.push({ value: String(hours), unit: "시간" });
  }

  if (minutes > 0) {
    parts.push({ value: String(minutes), unit: "분" });
  }

  // 만약 0.5분 같은 케이스로 인해 parts가 비게 될 경우를 대비한 방어코드
  // (현재 로직 상으로는 발생하지 않습니다.)
  if (parts.length === 0) {
    return [{ value: "0", unit: "분" }];
  }

  return parts;
};
