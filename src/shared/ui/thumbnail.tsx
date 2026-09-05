import { ImageIcon } from "lucide-react";
import Image from "next/image";
import type { ComponentProps } from "react";

import { cn } from "../lib";

interface ThumbnailProps
  extends Omit<ComponentProps<"div">, "children"> {
  src?: string | null;
  alt: string;
  sizes?: string;
  priority?: boolean;
  objectFit?: "cover" | "contain";
}

/**
 * 표지 이미지 자리. 부모가 정한 크기를 그대로 채운다(`size-full`).
 *
 * `next/image`의 `fill`은 부모가 `relative`여야 동작하는데 잊기 쉬워서 여기서
 * 감춘다. `docs/portability.md`가 `next/image` 사용처를 어댑터로 모으라고 한 것도
 * 같은 자리다 — Vite로 옮길 때 고칠 파일이 이 하나로 줄어든다.
 *
 * radius는 DESIGN.md ④의 책 표지 썸네일 규격(`rounded-[4px]`)을 기본값으로 둔다.
 */
export function Thumbnail({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 33vw, 20vw",
  priority = false,
  objectFit = "cover",
  ...props
}: ThumbnailProps) {
  return (
    <div
      className={cn(
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
          <ImageIcon size={20} strokeWidth={2} className="text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
