import {
  getHours,
  getMinutes,
  getSeconds,
  setHours,
  setMinutes,
  setSeconds,
  startOfDay,
} from "date-fns";

import { getValidHour, getValidMinuteOrSecond } from "../lib";

export type PickerType = "hours" | "minutes" | "seconds";

/** 값이 없을 때 보여줄 자리 표시 */
export const EMPTY_SEGMENT = "--";

interface UseTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

interface ReturnTimePicker {
  second: string;
  hour: string;
  minute: string;
  setTime: (value: string, type: PickerType) => void;
  stepTime: (step: number, type: PickerType) => void;
}

const pad = (value: number): string => String(value).padStart(2, "0");

export const useTimepicker = ({
  date,
  setDate,
}: UseTimePickerProps): ReturnTimePicker => {
  /**
   * 값이 없으면 "--"를 보여준다.
   * 예전에는 date ?? new Date()로 현재 시각을 그렸는데,
   * 폼에는 아무 값도 없는 상태라 화면과 실제 값이 어긋났다.
   */
  const hour = date ? pad(getHours(date)) : EMPTY_SEGMENT;
  const minute = date ? pad(getMinutes(date)) : EMPTY_SEGMENT;
  const second = date ? pad(getSeconds(date)) : EMPTY_SEGMENT;

  const setTime = (value: string, type: PickerType) => {
    // 값이 없는 상태에서 처음 입력하면 오늘 날짜 00:00:00을 기준으로 시각을 만든다.
    // new Date()를 그대로 쓰면 아직 입력하지 않은 필드에 그 순간의 실제
    // 분·초가 섞여 들어간다.
    const baseDate = date ?? startOfDay(new Date());
    const numericValue = parseInt(value, 10);

    if (Number.isNaN(numericValue)) return;

    switch (type) {
      case "hours":
        setDate(setHours(baseDate, numericValue));
        break;
      case "minutes":
        setDate(setMinutes(baseDate, numericValue));
        break;
      case "seconds":
        setDate(setSeconds(baseDate, numericValue));
        break;
      default:
    }
  };

  const stepTime = (step: number, type: PickerType) => {
    const baseDate = date ?? startOfDay(new Date());
    const currentVal = {
      hours: getHours(baseDate),
      minutes: getMinutes(baseDate),
      seconds: getSeconds(baseDate),
    };

    const newNumericValue = currentVal[type] + step;
    // 경계를 넘으면 반대편으로 순환시킨다 (23 → 00, 00 → 23)
    const validValue =
      type === "hours"
        ? getValidHour(String(newNumericValue))
        : getValidMinuteOrSecond(String(newNumericValue));

    setTime(validValue, type);
  };

  return {
    hour,
    minute,
    second,
    setTime,
    stepTime,
  };
};
