"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_ITEMS, isNavItemActive } from "../model/nav-items";

import { cn } from "@/shared/lib";

/** md 미만 전용 바텀 탭 내비게이션. DESIGN.md ⑧ 반응형 정책. */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="주 메뉴"
      className="grid shrink-0 grid-cols-3 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = isNavItemActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-11 flex-col items-center justify-center gap-1 py-2 text-xs font-medium",
              active ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Icon size={24} strokeWidth={2} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
