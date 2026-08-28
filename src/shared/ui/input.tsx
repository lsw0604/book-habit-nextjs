import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/shared/lib"

/**
 * DESIGN.md ④ Component Stylings의 Input 규정에 맞춰 shadcn 기본값을 수정했다.
 *
 * `shadcn add input`으로 재설치하면 덮어써진다. 그때 다시 적용할 항목:
 *
 * - padding 10px 12px, Body 16px (기본은 h-8 px-2.5 py-1 text-sm)
 * - focus: border.focus + `0 0 0 3px` at **20%** (기본은 50%)
 * - disabled: 배경 action.disabled (기본은 opacity-50)
 *
 * Button의 focus는 2px solid + offset이고 Input은 3px 그림자다.
 * 규정이 서로 달라 일부러 다르게 뒀다.
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "w-full min-w-0 rounded-lg border border-input bg-transparent px-3 py-2.5 text-base transition-colors outline-none",
        "file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "placeholder:text-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-disabled disabled:text-muted-foreground",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        "dark:bg-input/30",
        className
      )}
      {...props}
    />
  )
}

export { Input }
