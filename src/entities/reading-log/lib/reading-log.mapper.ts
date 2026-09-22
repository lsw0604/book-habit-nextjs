import { normalizedDate } from "@/shared/lib";

import type { ReadingLogDetailDTO, ReadingLogListItemDTO } from "../api";
import type { ReadingLogDetail, ReadingLogSummary } from "../model";
import {
  formatReadingLogDuration,
  formatReadingLogTimeRange,
} from "./reading-log.formatter";

/** 그 기록에서 실제로 읽은 페이지 수. */
function toPagesRead(startPage: number, endPage: number): number {
  return endPage - startPage;
}

export const toReadingLogSummaryViewModel = (
  dto: ReadingLogListItemDTO,
): ReadingLogSummary => ({
  id: dto.id,
  myBookId: dto.myBookId,
  startPage: dto.startPage,
  endPage: dto.endPage,
  pagesRead: toPagesRead(dto.startPage, dto.endPage),
  date: normalizedDate(dto.date),
  timeRangeLabel: formatReadingLogTimeRange(dto.startTime, dto.endTime),
  readingMinutes: dto.readingMinutes,
  durationLabel: formatReadingLogDuration(dto.readingMinutes),
  memo: dto.memo,
  title: dto.book.title,
  thumbnail: dto.book.thumbnail,
});

export const toReadingLogDetailViewModel = (
  dto: ReadingLogDetailDTO,
): ReadingLogDetail => ({
  id: dto.id,
  myBookId: dto.myBookId,
  startPage: dto.startPage,
  endPage: dto.endPage,
  pagesRead: toPagesRead(dto.startPage, dto.endPage),
  date: normalizedDate(dto.date),
  timeRangeLabel: formatReadingLogTimeRange(dto.startTime, dto.endTime),
  readingMinutes: dto.readingMinutes,
  durationLabel: formatReadingLogDuration(dto.readingMinutes),
  memo: dto.memo,
});
