"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_ITEMS, isNavItemActive } from "../model/nav-items";

import { cn } from "@/shared/lib";

/**
 * md 이상에서 바텀네비를 대신하는 사이드바.
 * md~lg: 아이콘만(collapsed) · lg~: 라벨까지 전체 노출. DESIGN.md ⑧ 반응형 정책.
 */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="주 메뉴"
      className="hidden shrink-0 flex-col gap-1 border-r border-border bg-background p-2 md:flex md:w-16 lg:w-60 lg:p-4"
    >
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = isNavItemActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors md:justify-center lg:justify-start",
              active
                ? "bg-accent text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <Icon size={24} strokeWidth={2} className="shrink-0" />
            <span className="hidden lg:inline">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
