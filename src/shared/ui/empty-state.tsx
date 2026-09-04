import type { LucideIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/shared/lib";

interface EmptyStateProps extends Omit<ComponentProps<"div">, "title"> {
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  /**
   * `error`는 아이콘만 `text-destructive`로 물들인다. 배경까지 상태색으로
   * 칠하지 않는 이유는 DESIGN.md ⑦ — 상태색은 상태 표시 전용이고 배경 장식이 아니다.
   */
  variant?: "default" | "error";
  /** 재시도·검색 초기화 같은 후속 액션. `ghost` Button을 넣는다. */
  children?: ReactNode;
}

/**
 * 리스트·상세 패널이 보여줄 게 없을 때 그 자리를 채우는 상태 화면.
 * empty·error·idle이 전부 같은 뼈대를 쓰도록 강제하는 게 목적이다 —
 * 화면마다 정렬과 아이콘 유무가 달라지면 같은 상황을 다른 화면으로 오인한다.
 *
 * 배경·테두리·아이콘 배지를 두지 않는다(DESIGN.md ①의 Notion 톤). 리스트가
 * 있어야 할 자리에 서피스나 큰 배지가 떠오르면 "비어 있다"가 아니라 "무언가
 * 하나 있다"로 읽힌다. 위계는 색과 여백으로만 만든다.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  variant = "default",
  children,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-4 px-4 py-10 text-center",
        className,
      )}
      {...props}
    >
      {/* 제목에 사용자가 입력한 검색어가 실릴 수 있어 max-w + wrap-break-word로 가둔다. */}
      <div className="flex max-w-xs flex-col items-center gap-2 wrap-break-word">
        <Icon
          size={20}
          strokeWidth={2}
          aria-hidden
          className={
            variant === "error" ? "text-destructive" : "text-muted-foreground"
          }
        />

        <div className="flex flex-col gap-1">
          {/*
           * 의미론적으로는 제목이라 h3를 쓰되, 시각 스케일은 Body로 낮춘다.
           * 빈 화면의 안내 문구가 섹션 제목만 한 무게를 가지면 "없음"이
           * 화면의 주인공이 된다. 같은 이유로 색도 text-title이 아닌 foreground다.
           */}
          <h3 className="text-base leading-[1.6] font-medium text-foreground">
            {title}
          </h3>
          {description ? (
            <p className="text-sm leading-normal whitespace-pre-line text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      {children}
    </div>
  );
}
