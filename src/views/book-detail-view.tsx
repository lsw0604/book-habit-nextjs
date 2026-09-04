"use client";

import {
  AlertTriangleIcon,
  ExternalLinkIcon,
  NewspaperIcon,
  RotateCcwIcon,
} from "lucide-react";

import { BookCardThumbnail, useFetchBookDetail } from "@/entities/book";
import type { BookDetail } from "@/entities/book";
import { cn } from "@/shared/lib";
import { Button, buttonVariants, EmptyState, Skeleton } from "@/shared/ui";

interface BookDetailViewProps {
  isbn: string;
}

export function BookDetailView({ isbn }: BookDetailViewProps) {
  const {
    data: book,
    error,
    isPending,
    isError,
    refetch,
  } = useFetchBookDetail(isbn);

  if (isPending) return <BookDetailSkeleton />;

  if (isError || !book) {
    return (
      <EmptyState
        variant="error"
        icon={AlertTriangleIcon}
        title="책 정보를 불러오지 못했어요"
        description={error?.userMessage ?? "잠시 후 다시 시도해 주세요."}
      >
        <Button variant="ghost" size="sm" onClick={() => refetch()}>
          <RotateCcwIcon />
          다시 시도
        </Button>
      </EmptyState>
    );
  }

  /*
   * 검색 리스트가 ISSN에 링크를 걸지 않으므로 보통은 여기 닿지 않는다. 하지만 URL
   * 직접 입력·예전 링크·북마크로는 들어올 수 있어 같은 판단을 한 번 더 한다.
   * 목록에서만 막으면 "리스트에선 안 되는데 링크로는 되네"가 되어 규칙이 새어 나간다.
   */
  if (book.identifier?.type === "ISSN") {
    return (
      <EmptyState
        icon={NewspaperIcon}
        title="정기간행물은 기록할 수 없어요"
        description="잡지·학술지는 아직 지원하지 않습니다. 단행본을 검색해 주세요."
      />
    );
  }

  return (
    /*
     * 읽기 폭을 max-w-3xl로 제한한다. lg 이상에서 detail 패널이 넓어지면
     * 책 소개 본문이 한 줄에 100자 넘게 흘러 읽기 어려워진다(⑤ 컨테이너 규칙).
     */
    <article className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 md:p-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:gap-6">
        {/*
         * 표지 비율은 aspect로 고정한다. 책마다 원본 비율이 달라 고정 높이를 주면
         * 어떤 책은 잘리고 어떤 책은 여백이 남는다. 상세 화면은 표지 전체를
         * 보여주는 자리라 objectFit도 contain이다(리스트 썸네일은 cover).
         */}
        <div className="aspect-5/7 w-40 shrink-0 self-start sm:w-48">
          <BookCardThumbnail
            src={book.coverImage}
            alt={`${book.title} 표지`}
            sizes="(max-width: 640px) 160px, 192px"
            objectFit="contain"
            priority
            className="shadow-elevation-1"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-[1.75rem] leading-tight font-bold tracking-[-0.01em] text-title md:text-[2rem]">
              {book.title}
            </h1>
            {book.subTitle ? (
              <p className="text-base leading-[1.6] text-muted-foreground">
                {book.subTitle}
              </p>
            ) : null}
          </div>

          <BookInfoTable book={book} />

          {book.url ? (
            <a
              href={book.url}
              target="_blank"
              rel="noreferrer noopener"
              /*
               * size가 주는 좌우 padding을 지운다. link variant는 텍스트가 곧
               * 경계라, padding이 남으면 위 정보 블록보다 들여쓰인 것처럼 보인다.
               */
              className={cn(
                buttonVariants({ variant: "link", size: "sm" }),
                "self-start px-0",
              )}
            >
              원본 정보 보기
              <ExternalLinkIcon />
              <span className="sr-only">(새 창에서 열림)</span>
            </a>
          ) : null}
        </div>
      </header>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl leading-[1.3] font-bold tracking-[-0.01em] text-title md:text-2xl">
          책 소개
        </h2>
        <p className="text-sm whitespace-pre-line text-foreground">
          {book.description || "등록된 책 소개가 없습니다."}
        </p>
      </section>
    </article>
  );
}

/**
 * 라벨-값 쌍이라 `dl`을 쓴다. 스크린리더가 "작가, 김영하"처럼 짝으로 읽어주고,
 * 시각적으로도 좌우 정렬이 그 관계를 그대로 드러낸다.
 *
 * 역자는 없는 책이 더 많아 있을 때만 행을 만든다. "역자: 정보 없음"을 남기면
 * 번역서가 아닌 책에까지 빈 줄이 생긴다.
 */
function BookInfoTable({ book }: { book: BookDetail }) {
  const items = [
    { label: "작가", value: book.authors },
    book.translators ? { label: "역자", value: book.translators } : null,
    { label: "출판일", value: book.pubDate },
    { label: "출판사", value: book.publisher ?? "정보 없음" },
    { label: "책 페이지", value: book.totalPage },
  ].filter((item) => item !== null);

  return (
    <dl className="flex flex-col gap-2 rounded-xl bg-muted p-4 text-sm">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center justify-between gap-4"
        >
          <dt className="shrink-0 font-medium text-muted-foreground">
            {item.label}
          </dt>
          {/* 저자가 여러 명이면 길어져 라벨을 밀어낸다. 넘치는 쪽만 자른다. */}
          <dd className="min-w-0 truncate font-semibold text-foreground">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** 실물과 같은 태그·같은 여백을 쓴다(DESIGN.md ⑦). 줄 높이가 튀면 스켈레톤이 오히려 지연으로 느껴진다. */
function BookDetailSkeleton() {
  return (
    <div
      aria-busy
      aria-label="책 정보를 불러오는 중"
      className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 md:p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
        <Skeleton className="aspect-5/7 w-40 shrink-0 self-start rounded-[4px] sm:w-48" />

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}
