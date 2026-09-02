import { CalendarDays, Home, Search, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

/**
 * 데모용 내비게이션 항목. 실제 IA(서재·기록·통계 등)가 정해지면 교체한다.
 * 지금은 (main) 그룹에 실존하는 라우트만 연결한다.
 */
export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "홈", icon: Home },
  { href: "/search", label: "검색", icon: Search },
  { href: "/activity-calendar-demo", label: "캘린더", icon: CalendarDays },
];

export function isNavItemActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
