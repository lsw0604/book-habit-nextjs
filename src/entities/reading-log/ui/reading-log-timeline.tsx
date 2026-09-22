"use client";

import { ClockIcon } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

import { cn, formatDate, formatMinutes, groupItemsByDate } from "@/shared/lib";
import { Thumbnail } from "@/shared/ui";

import type { ReadingLogSummary } from "../model";

interface ReadingLogTimelineProps {
  logs: readonly ReadingLogSummary[];
  /** 항목마다 책 표지·제목을 보여줄지. 기본 `true`. 책이 이미 하나로 정해진 화면(도서 상세)에서는 반복을 줄이려 `false`로 끈다. */
  showBook?: boolean;
  /** 항목 우측 액션 슬롯(수정·삭제 등). entities는 features를 참조할 수 없어(architecture.md 골든룰 2) 자리만 비워둔다. */
  renderActions?: (log: ReadingLogSummary) => ReactNode;
  /** 이 날짜의 그룹으로 스크롤한다. 기록이 없으면 가장 가까운 날짜로 대신 이동하고, URL은 호출부가 그대로 둔다. */
  focusDate?: Date;
}

/** `dateKeys`가 비어 있지 않다고 가정한다(호출부가 먼저 길이를 확인한다). */
function findNearestDateKey(
  dateKeys: readonly string[],
  grouped: { readonly [dateKey: string]: readonly ReadingLogSummary[] },
  target: Date,
): string {
  return dateKeys.reduce((nearest, key) => {
    const keyDiff = Math.abs(grouped[key][0].date.getTime() - target.getTime());
    const nearestDiff = Math.abs(
      grouped[nearest][0].date.getTime() - target.getTime(),
    );
    return keyDiff < nearestDiff ? key : nearest;
  });
}

/**
 * 독서 기록을 날짜별로 묶어 세로 타임라인으로 보여준다.
 * 빈 배열·로딩·에러 처리는 호출부(view)가 `EmptyState`/`Skeleton`으로 맡는다.
 */
export function ReadingLogTimeline({
  logs,
  showBook = true,
  renderActions,
  focusDate,
}: ReadingLogTimelineProps) {
  const grouped = groupItemsByDate(logs);
  const dateKeys = Object.keys(grouped).sort().reverse();
  const focusDateKey =
    focusDate && dateKeys.length > 0
      ? findNearestDateKey(dateKeys, grouped, focusDate)
      : null;

  const groupRefs = useRef(new Map<string, HTMLLIElement>());

  useEffect(() => {
    if (!focusDateKey) return;
    groupRefs.current
      .get(focusDateKey)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [focusDateKey]);

  return (
    <ol className="flex flex-col gap-6">
      {dateKeys.map((dateKey) => {
        const dayLogs = [...grouped[dateKey]].sort(
          (a, b) => b.date.getTime() - a.date.getTime(),
        );
        const totalMinutes = dayLogs.reduce(
          (sum, log) => sum + log.readingMinutes,
          0,
        );
        const isFocused = dateKey === focusDateKey;

        return (
          <li
            key={dateKey}
            ref={(el) => {
              if (el) groupRefs.current.set(dateKey, el);
              else groupRefs.current.delete(dateKey);
            }}
            className="flex scroll-mt-4 flex-col gap-3"
          >
            <div className="flex items-baseline justify-between gap-2">
              {/* 형광펜 스타일 강조. bg-accent는 hover 등 일시적 피드백에 이미 쓰이는 색이다. */}
              <h3
                className={cn(
                  "rounded text-sm leading-normal font-semibold text-title",
                  isFocused && "bg-accent px-1",
                )}
              >
                {formatDate(dateKey, "long")}
              </h3>
              <span className="font-mono text-xs text-muted-foreground">
                {formatMinutes(totalMinutes)}
              </span>
            </div>

            <ol className="flex flex-col">
              {dayLogs.map((log, index) => (
                <ReadingLogTimelineItem
                  key={log.id}
                  log={log}
                  isLast={index === dayLogs.length - 1}
                  showBook={showBook}
                  renderActions={renderActions}
                />
              ))}
            </ol>
          </li>
        );
      })}
    </ol>
  );
}

/** 점·선은 절대좌표 없이 flex의 기본 `align-items: stretch`로 콘텐츠 높이에 맞춰 늘어난다. */
function ReadingLogTimelineItem({
  log,
  isLast,
  showBook,
  renderActions,
}: {
  log: ReadingLogSummary;
  isLast: boolean;
  showBook: boolean;
  renderActions?: (log: ReadingLogSummary) => ReactNode;
}) {
  return (
    <li className="flex gap-3">
      <div className="flex flex-col items-center">
        <span
          aria-hidden
          className="mt-1.5 size-2.5 shrink-0 rounded-full bg-primary"
        />
        {!isLast && <span aria-hidden className="w-px flex-1 bg-border" />}
      </div>

      <div className="flex min-w-0 flex-1 gap-3 pb-6">
        {showBook ? (
          <div className="relative aspect-5/7 w-10 shrink-0 self-start">
            <Thumbnail
              src={log.thumbnail}
              alt={`${log.title} 표지`}
              sizes="40px"
            />
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {showBook ? (
            <h4 className="line-clamp-1 text-sm leading-normal font-medium text-title">
              {log.title}
            </h4>
          ) : null}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs leading-[1.4] font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <ClockIcon size={16} strokeWidth={2} aria-hidden />
              {log.timeRangeLabel}
            </span>
            <span className="font-mono">{log.durationLabel}</span>
            <span className="font-mono">{log.pagesRead}쪽 읽음</span>
          </div>

          {log.memo ? (
            <p className="mt-1 line-clamp-2 border-l-2 border-border pl-3 text-sm leading-[1.6] text-foreground">
              {log.memo}
            </p>
          ) : null}
        </div>

        {/* self-start: 나머지 칼럼이 그렇듯, 얹지 않으면 flex의 기본 stretch로 늘어난다. */}
        {renderActions ? (
          <div className="flex shrink-0 items-center gap-1 self-start">
            {renderActions(log)}
          </div>
        ) : null}
      </div>
    </li>
  );
}
