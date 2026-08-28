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
