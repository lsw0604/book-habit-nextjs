import { endOfDay, format, isAfter, isBefore, isValid, parse } from "date-fns";

import {
  INPUT_DATEPICKER_CONSTRAINTS,
  INPUT_DATEPICKER_ERROR_MESSAGES,
  INPUT_DATEPICKER_FORMAT,
  INPUT_DATEPICKER_LENGTH,
} from "./constants";

/**
 * 텍스트 입력의 허용 범위. 캘린더에 넘기는 fromDate/toDate와 같은 값을 쓴다.
 * 둘이 어긋나면 캘린더로는 못 고르는 날짜를 타이핑으로 넣을 수 있다.
 */
export interface DateBounds {
  fromDate: Date;
  toDate: Date;
}

interface DateValidateResult {
  date: Date | null;
  error: string | null;
}

const validateYear = (year: number, bounds: DateBounds): string | null => {
  const minYear = bounds.fromDate.getFullYear();
  const maxYear = bounds.toDate.getFullYear();

  if (year < minYear || year > maxYear) {
    return INPUT_DATEPICKER_ERROR_MESSAGES.INVALID_YEAR(minYear, maxYear);
  }
  return null;
};

const validateMonth = (month: number): string | null => {
  if (
    month < INPUT_DATEPICKER_CONSTRAINTS.MIN_MONTH ||
    month > INPUT_DATEPICKER_CONSTRAINTS.MAX_MONTH
  ) {
    return INPUT_DATEPICKER_ERROR_MESSAGES.INVALID_MONTH;
  }
  return null;
};

const validateRange = (date: Date, bounds: DateBounds): string | null => {
  if (isBefore(date, bounds.fromDate) || isAfter(date, endOfDay(bounds.toDate))) {
    return INPUT_DATEPICKER_ERROR_MESSAGES.OUT_OF_RANGE(
      format(bounds.fromDate, INPUT_DATEPICKER_FORMAT.DISPLAY),
      format(bounds.toDate, INPUT_DATEPICKER_FORMAT.DISPLAY)
    );
  }
  return null;
};

export const parseAndValidateDate = (
  digits: string,
  bounds: DateBounds
): DateValidateResult => {
  const parsedDate = parse(digits, INPUT_DATEPICKER_FORMAT.PARSE, new Date());
  const year = parseInt(digits.substring(0, INPUT_DATEPICKER_LENGTH.YEAR), 10);

  // parse는 2월 30일을 3월 2일로 넘기지 않지만, 연도 자릿수가 어긋나는 경우가 있어 함께 확인한다
  if (!isValid(parsedDate) || parsedDate.getFullYear() !== year) {
    return { date: null, error: INPUT_DATEPICKER_ERROR_MESSAGES.INVALID_DATE };
  }

  const rangeError = validateRange(parsedDate, bounds);
  if (rangeError) {
    return { date: null, error: rangeError };
  }

  return { date: parsedDate, error: null };
};

/**
 * 입력하는 도중(8자리 미만)에도 연·월이 확정되면 즉시 알려준다.
 */
export const validatePartialDate = (
  digits: string,
  bounds: DateBounds
): string | null => {
  if (digits.length >= INPUT_DATEPICKER_LENGTH.YEAR) {
    const year = parseInt(
      digits.substring(0, INPUT_DATEPICKER_LENGTH.YEAR),
      10
    );
    const yearError = validateYear(year, bounds);
    if (yearError) return yearError;
  }

  if (digits.length >= INPUT_DATEPICKER_LENGTH.MONTH) {
    const month = parseInt(
      digits.substring(
        INPUT_DATEPICKER_LENGTH.YEAR,
        INPUT_DATEPICKER_LENGTH.MONTH
      ),
      10
    );
    const monthError = validateMonth(month);
    if (monthError) return monthError;
  }

  return null;
};
