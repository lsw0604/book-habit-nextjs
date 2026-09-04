import type { ComponentProps } from "react";

import { cn } from "@/shared/lib";

interface BookCardDescriptionProps extends ComponentProps<"p"> {
  description?: string | null;
}

export function BookCardDescription({
  description,
  className,
  ...props
}: BookCardDescriptionProps) {
  return (
    <p className={cn("text-sm whitespace-pre-line text-foreground", className)} {...props}>
      {description || "해당 책의 정보가 등록되지 않았습니다."}
    </p>
  );
}
