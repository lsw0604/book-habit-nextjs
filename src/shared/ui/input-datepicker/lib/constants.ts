export const INPUT_DATEPICKER_CONSTRAINTS = {
  MIN_YEAR: 1900,
  MAX_YEAR: 2100,
  MIN_MONTH: 1,
  MAX_MONTH: 12,
  MAX_DIGITS: 8,
} as const;

export const INPUT_DATEPICKER_ERROR_MESSAGES = {
  /** 선택 가능 범위가 prop으로 조절되므로 연도 메시지는 값에 따라 만든다 */
  INVALID_YEAR: (minYear: number, maxYear: number) =>
    `${minYear}년에서 ${maxYear}년 사이 년도를 입력해주세요.`,
  INVALID_MONTH: `0${INPUT_DATEPICKER_CONSTRAINTS.MIN_MONTH}월에서 ${INPUT_DATEPICKER_CONSTRAINTS.MAX_MONTH}월 사이 월을 입력해주세요.`,
  INVALID_DATE: "유효하지 않은 날짜입니다. (예: 2월 30일)",
  OUT_OF_RANGE: (fromLabel: string, toLabel: string) =>
    `${fromLabel} ~ ${toLabel} 사이의 날짜를 입력해주세요.`,
} as const;

export const INPUT_DATEPICKER_FORMAT = {
  PARSE: "yyyyMMdd",
  DISPLAY: "yyyy-MM-dd",
} as const;

export const INPUT_DATEPICKER_LENGTH = {
  YEAR: 4,
  MONTH: 6,
  DAY: 8,
} as const;
