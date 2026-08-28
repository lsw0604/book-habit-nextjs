import * as React from "react"

import { cn } from "@/shared/lib"

/**
 * Input과 같은 규정을 따른다 (DESIGN.md ④ Input).
 * 서평·노트 본문을 받는 자리라 `md:text-sm`으로 줄이지 않고 Body 16px를 유지한다.
 * DESIGN.md ①이 "텍스트 콘텐츠는 가독성 최우선"이라고 정하기 때문이다.
 *
 * `shadcn add textarea`로 재설치하면 덮어써진다.
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-3 py-2.5 text-base leading-relaxed transition-colors outline-none",
        "placeholder:text-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20",
        "disabled:cursor-not-allowed disabled:bg-disabled disabled:text-muted-foreground",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        "dark:bg-input/30",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
