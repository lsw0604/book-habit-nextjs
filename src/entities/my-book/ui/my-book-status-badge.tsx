import { BookCheck, BookmarkPlus, BookOpen } from "lucide-react";

import { Badge } from "@/shared/ui";

import { MY_BOOK_STATUS, type MyBookStatus } from "../model";

/**
 * 세 상태 모두 같은 칩(배경·테두리·글자색)을 쓰고 아이콘·라벨만 다르다.
 *
 * 원래는 outline/highlight/success로 상태마다 다른 스타일을 줬지만, 이 배지가
 * `MyBookCard`에서 표지 위에 겹쳐지면서 그 전제가 깨졌다 — 표지 자체가 이미
 * 다채로운 색인데 배지까지 상태별로 색이 바뀌면 코너가 산만해진다. 칩 하나로
 * 통일하고 상태 구분은 아이콘·라벨에 맡긴다(`MyBookButton`과 같은 아이콘 셋).
 *
 * 배경이 불투명한 `bg-card`가 아니라 `bg-background/85`인 이유는 DESIGN.md에
 * 스크림 토큰이 없어서다 — `ActivityCalendar`의 `BookCoverDay`가 표지 위 날짜
 * 숫자에 쓰는 것과 같은 근거(배경색의 불투명도로 스크림을 만든다)를 그대로
 * 재사용한다. 표지 밖(상세 화면, 서재 상태 바)에서도 같은 칩을 쓰므로, 이
 * 배경이 플랫한 페이지 위에서도 어색하지 않아야 한다 — `bg-background`는
 * 페이지 배경과 같은 색이라 85%로 낮춰도 옅은 카드처럼 보일 뿐 튀지 않는다.
 */
const STATUS_PRESET = {
  [MY_BOOK_STATUS.WANT_TO_READ]: { label: "읽고 싶음", icon: BookmarkPlus },
  [MY_BOOK_STATUS.CURRENTLY_READING]: { label: "읽는 중", icon: BookOpen },
  [MY_BOOK_STATUS.READ]: { label: "완독", icon: BookCheck },
} as const;

export function MyBookStatusBadge({ status }: { status: MyBookStatus }) {
  const { label, icon: Icon } = STATUS_PRESET[status];

  return (
    <Badge
      variant="outline"
      className="border-border bg-background/85 text-foreground"
    >
      <Icon aria-hidden />
      {label}
    </Badge>
  );
}
