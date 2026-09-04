import { ImageIcon } from "lucide-react";
import Image from "next/image";
import type { ComponentProps } from "react";

import { cn } from "@/shared/lib";

interface BookCardThumbnailProps extends Omit<
  ComponentProps<"div">,
  "children"
> {
  src?: string | null;
  alt: string;
  sizes?: string;
  priority?: boolean;
  objectFit?: "cover" | "contain";
}

export function BookCardThumbnail({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 33vw, 20vw",
  priority = false,
  objectFit = "cover",
  ...props
}: BookCardThumbnailProps) {
  return (
    <div
      className={cn(
        // DESIGN.md ④ Radius: 책 표지 썸네일은 rounded-[4px]다(rounded-lg 8px는 버튼·인풋).
        "relative size-full shrink-0 overflow-hidden rounded-[4px] bg-muted",
        className,
      )}
      {...props}
    >
      {src ? (
        <Image
          src={src}
          sizes={sizes}
          priority={priority}
          fill
          alt={alt}
          className={cn(
            "transition-opacity duration-300",
            objectFit === "cover" ? "object-cover" : "object-contain",
          )}
        />
      ) : (
        <div className="flex size-full items-center justify-center bg-muted">
          <ImageIcon
            size={20}
            strokeWidth={2}
            className="text-muted-foreground"
          />
        </div>
      )}
    </div>
  );
}
