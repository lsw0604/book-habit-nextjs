import { StarIcon } from "lucide-react";

import { Progress, Thumbnail } from "@/shared/ui";

import type { MyBookSummary } from "../model";
import { MyBookStatusBadge } from "./my-book-status-badge";

interface MyBookCardProps {
  myBook: MyBookSummary;
}

/**
 * 서재 그리드의 한 칸. 검색 결과가 리스트 로우인 것과 일부러 다르다 —
 * 검색은 제목·저자로 **찾는** 화면이라 텍스트가 주인공이고, 서재는 내 책을
 * **둘러보는** 화면이라 표지가 주인공이다.
 *
 * Card로 감싸지 않는다(DESIGN.md ④). 표지 자체가 경계 역할을 하므로 테두리를
 * 두르면 장식만 늘고 ①의 톤에서 멀어진다.
 *
 * 상태 배지·별점은 제목 아래가 아니라 표지 좌측 상단에 겹쳐 놓는다. 그리드 한
 * 칸이 좁아 텍스트 줄로 두면 제목과 같이 좁은 폭을 다투는데, 표지 위에 얹으면
 * 표지 자체가 여유 공간이 되어 칸이 더 컴팩트해진다. 좌측 상단은
 * `ActivityCalendar`의 날짜 숫자와 같은 자리다(DESIGN.md) — 같은 코너를
 * 재사용해 "정보는 왼쪽 위"라는 약속을 카드 밖에서도 지킨다.
 */
export function MyBookCard({ myBook }: MyBookCardProps) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="relative aspect-5/7 w-full">
        <Thumbnail
          src={myBook.thumbnail}
          alt={`${myBook.title} 표지`}
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
          className="shadow-elevation-1"
        />

        <div className="absolute top-1 left-1 flex flex-col items-start gap-1">
          <MyBookStatusBadge status={myBook.status} />
          {/* 0은 "미평가"라 별을 띄우지 않는다. 0점을 준 것과 구분되어야 한다. */}
          {myBook.rating > 0 ? <MyBookRating value={myBook.rating} /> : null}
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-1">
        <h3 className="line-clamp-2 text-sm leading-normal font-medium text-title">
          {myBook.title}
        </h3>

        {/*
         * 총 페이지를 모르면 진행률 자체가 없다. 빈 바는 "0% 읽음"으로 읽혀
         * 거짓말이 되므로 줄을 통째로 뺀다(DESIGN.md ④ Progress).
         *
         * 칸이 좁아 수치는 따로 적지 않는다. 정확한 값은 `aria-valuenow`가 싣는다.
         */}
        {myBook.progress !== null ? (
          <Progress
            value={myBook.progress}
            label={`${myBook.title} 읽기 진행률`}
            className="mt-1"
          />
        ) : null}
      </div>
    </div>
  );
}

/**
 * 표지 위에 얹히므로 `MyBookStatusBadge`와 같은 스크림(`bg-background/85`)을
 * 쓴다 — 별개 칩처럼 보이면 코너 스택이 아니라 흩어진 배지 두 개로 읽힌다.
 */
function MyBookRating({ value }: { value: number }) {
  return (
    <span className="flex shrink-0 items-center gap-1 rounded-full border border-border bg-background/85 px-2 py-1 text-xs leading-[1.4] font-medium text-foreground">
      <StarIcon
        size={12}
        strokeWidth={2}
        className="fill-current"
        aria-hidden
      />
      <span className="font-mono">{value.toFixed(1)}</span>
      <span className="sr-only">점 (5점 만점)</span>
    </span>
  );
}
