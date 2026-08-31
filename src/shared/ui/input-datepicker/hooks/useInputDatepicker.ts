import { format } from "date-fns";
import { type ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import type { OnSelectHandler } from "react-day-picker";

import {
  INPUT_DATEPICKER_CONSTRAINTS,
  INPUT_DATEPICKER_FORMAT,
} from "../lib/constants";
import { extractDigits, addSeparatorsToDateString } from "../lib/formatter";
import {
  type DateBounds,
  validatePartialDate,
  parseAndValidateDate,
} from "../lib/validator";

interface UseInputDatepickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  bounds: DateBounds;
  externalError?: boolean;
}

interface UseInputDatepickerReturn {
  dateStr: string;
  error: string | null;
  hasError: boolean;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleCalendarSelect: OnSelectHandler<Date | undefined>;
  handleClearDate: () => void;
}

export const useInputDatepicker = ({
  value,
  onChange,
  bounds,
  externalError,
}: UseInputDatepickerProps): UseInputDatepickerReturn => {
  const [dateStr, setDateStr] = useState<string>(() =>
    value ? format(value, INPUT_DATEPICKER_FORMAT.DISPLAY) : ""
  );
  const [internalError, setInternalError] = useState<string | null>(null);

  const hasError = Boolean(internalError || externalError);

  /**
   * 우리가 올려보낸 값이 그대로 되돌아온 것인지 구분하는 기준.
   *
   * 입력 도중에는 "2025-0"처럼 날짜가 되지 못하는 문자열을 들고 있어야 하는데,
   * 그 시점의 value는 undefined다. 이걸 외부 초기화와 구분하지 못하면
   * 타이핑하는 족족 입력칸이 지워진다.
   */
  const emittedRef = useRef<Date | undefined>(value);

  const notifyChange = useCallback(
    (day: Date | undefined) => {
      emittedRef.current = day;
      onChange(day);
    },
    [onChange]
  );

  // 폼 reset처럼 밖에서 값이 바뀐 경우에만 입력칸을 값에 맞춘다
  useEffect(() => {
    if (value === emittedRef.current) return;

    emittedRef.current = value;
    setDateStr(value ? format(value, INPUT_DATEPICKER_FORMAT.DISPLAY) : "");
    setInternalError(null);
  }, [value]);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const digits = extractDigits(
        e.target.value,
        INPUT_DATEPICKER_CONSTRAINTS.MAX_DIGITS
      );
      setDateStr(addSeparatorsToDateString(digits));

      let newDate: Date | null = null;
      let newError: string | null = null;

      const partialError = validatePartialDate(digits, bounds);

      if (partialError) {
        newError = partialError;
      } else if (digits.length === INPUT_DATEPICKER_CONSTRAINTS.MAX_DIGITS) {
        const { date, error: fullError } = parseAndValidateDate(digits, bounds);

        if (fullError) {
          newError = fullError;
        } else {
          newDate = date;
        }
      }

      setInternalError(newError);

      if (newDate) {
        if (!value || newDate.getTime() !== value.getTime()) {
          notifyChange(newDate);
        }
      } else if (value) {
        // 날짜가 완성되지 않은 동안에는 값을 비워 둔다
        notifyChange(undefined);
      }
    },
    [value, notifyChange, bounds]
  );

  const handleCalendarSelect: OnSelectHandler<Date | undefined> = useCallback(
    (day) => {
      notifyChange(day);
      setInternalError(null);
      setDateStr(day ? format(day, INPUT_DATEPICKER_FORMAT.DISPLAY) : "");
    },
    [notifyChange],
  );

  const handleClearDate = useCallback(() => {
    notifyChange(undefined);
    setDateStr("");
    setInternalError(null);
  }, [notifyChange]);

  return {
    dateStr,
    error: internalError,
    hasError,
    handleInputChange,
    handleCalendarSelect,
    handleClearDate,
  };
};
