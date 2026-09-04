import type { ComponentProps } from "react";

import { cn } from "@/shared/lib";

interface BookInfoListProps extends ComponentProps<"div"> {
  authors: string;
  translators?: string;
  pubDate: string;
  publisher: string;
  totalPage: string;
}

export function BookInfoList({
  className,
  authors,
  translators,
  pubDate,
  publisher,
  totalPage,
  ...props
}: BookInfoListProps) {
  const infoItems = [
    { label: "작가", value: authors },
    translators ? { label: "역자", value: translators } : null,
    { label: "출판일", value: pubDate },
    { label: "출판사", value: publisher },
    { label: "책 페이지", value: totalPage },
  ].filter((item) => item !== null);

  return (
    <div className={cn("space-y-3.5 rounded-xl bg-muted p-4 text-sm", className)} {...props}>
      {infoItems.map((item) => (
        <div key={item.label} className="flex items-center justify-between">
          <span className="font-medium text-muted-foreground">{item.label}</span>
          <span className="font-semibold text-foreground">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
