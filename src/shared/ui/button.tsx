import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/shared/lib"

/**
 * DESIGN.md ④ Component Stylings의 Button 규정에 맞춰 shadcn 기본값을 수정했다.
 *
 * `shadcn add button`으로 재설치하면 이 파일이 덮어써진다. 그때는 아래
 * 항목들을 다시 적용해야 한다.
 *
 * - 크기: padding 10px 20px, Body 16px (shadcn 기본은 h-8 px-2.5 text-sm)
 * - hover: action.primaryHover로 색이 진해진다 (기본은 같은 색 80% 투명도)
 * - focus: 2px solid border.focus, offset 2px (기본은 3px ring 50%)
 * - disabled: 배경을 action.disabled로 교체 (기본은 opacity-50)
 * - outline: 테두리·텍스트가 action.primary (기본은 중립 border)
 *
 * 모바일 터치 타깃 44×44px(⑧절)도 이 padding에서 충족된다.
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:bg-disabled disabled:text-muted-foreground disabled:cursor-not-allowed aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        outline:
          "border-primary bg-transparent text-primary hover:bg-accent aria-expanded:bg-accent",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-primary-hover hover:text-primary-foreground aria-expanded:bg-secondary",
        ghost:
          "text-primary hover:bg-accent aria-expanded:bg-accent dark:hover:bg-accent/50",
        /** DESIGN.md ⑦ — Danger는 삭제·파괴적 액션에만 쓴다. */
        destructive:
          "bg-destructive text-primary-foreground hover:bg-destructive/85 focus-visible:ring-destructive",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        /** DESIGN.md 기준값: padding 10px 20px, Body 16px */
        default: "gap-2 px-5 py-2.5 text-base",
        sm: "gap-1.5 px-4 py-2 text-sm",
        lg: "gap-2 px-6 py-3 text-base",
        /** 터치 타깃 44×44px(⑧절) */
        icon: "size-11",
        "icon-sm": "size-9 [&_svg:not([class*='size-'])]:size-3.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
