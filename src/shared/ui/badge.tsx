import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/shared/lib";

/**
 * DESIGN.md ④ Radius(`rounded-full`)·③ Micro 타이포·⑤ space-sm을 조합한 배지.
 *
 * ## 배경을 채우는 배지 vs 글자만 물들이는 배지
 *
 * ⑦은 배지 색을 `bg-secondary` 또는 상태색 셋으로 제한하면서, 같은 절에서
 * "블루 배경은 **조작하는** 표면과 일시적 피드백에만"이라고 못박는다. 그래서
 * 클릭할 수 있는 배지는 `secondary`를 쓰지만, 필터 요약처럼 **읽기 전용으로
 * 항상 떠 있는** 배지는 배경을 채우면 그 규칙과 충돌한다. 그런 자리는
 * `outline`/`highlight`로 배경 없이 테두리와 글자만 쓴다.
 *
 * `highlight`의 글자가 `text-primary`가 아닌 `text-title`인 이유는 대비다.
 * 라이트에서 `--primary`(#2196F3)는 흰 배경 대비 약 3:1이라 12px 텍스트에는
 * WCAG AA(4.5:1)에 못 미친다. `--title`(#0D47A1)은 12:1이고, `--secondary-foreground`
 * 주석이 말하는 "배지 텍스트" 값이 정확히 이것이다.
 */
const badgeVariants = cva(
  "inline-flex shrink-0 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-xs leading-[1.4] font-medium whitespace-nowrap [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3",
  {
    variants: {
      variant: {
        /** 배경을 채운다. 클릭 가능한 배지 등 액션 표면에만. */
        secondary: "bg-secondary text-secondary-foreground",
        /** 배경 없이 테두리만. 강조하지 않는 중립 값(기본값 표시 등). */
        outline: "border-border text-muted-foreground",
        /** 배경 없이 글자를 물들인다. 표시 전용 배지의 강조. */
        highlight: "border-secondary text-title",
        success: "bg-success text-primary-foreground",
        warning: "bg-warning text-primary-foreground",
        destructive: "bg-destructive text-primary-foreground",
      },
    },
    defaultVariants: {
      variant: "secondary",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
