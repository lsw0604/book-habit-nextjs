import { Avatar, AvatarFallback } from "@/shared/ui";

/**
 * 모바일·PC 공통 상단 헤더.
 * 데모 단계라 아바타는 자리만 잡아둔다 — 실제 세션 연동은 이후 과제.
 */
export function Header() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4 md:h-16 md:px-6">
      <span className="text-lg font-bold tracking-[-0.01em] text-title">
        Book Habit
      </span>
      <Avatar size="sm">
        <AvatarFallback>?</AvatarFallback>
      </Avatar>
    </header>
  );
}
