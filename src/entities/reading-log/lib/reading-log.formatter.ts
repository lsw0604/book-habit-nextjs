import { formatDate, formatMinutes } from "@/shared/lib";

/** `14:00 - 14:30` 형태. */
export const formatReadingLogTimeRange = (
  startTime: string,
  endTime: string,
): string => `${formatDate(startTime, "time")} - ${formatDate(endTime, "time")}`;

/** 분 단위 값을 `1시간 35분` 같은 문장으로. */
export const formatReadingLogDuration = (readingMinutes: number): string =>
  formatMinutes(readingMinutes);
