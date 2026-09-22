import { GlobeIcon, HeartIcon, LockIcon, MessageCircleIcon } from "lucide-react";
import type { ReactNode } from "react";

import type { MyBookReviewDetail } from "../model";

interface MyBookReviewCardProps {
  review: MyBookReviewDetail;
  /** 우측 액션 슬롯(수정·삭제 등). entities는 features를 참조할 수 없어(architecture.md 골든룰 2) 자리만 비워둔다. */
  renderActions?: (review: MyBookReviewDetail) => ReactNode;
}

/**
 * 내가 이 책에 남긴 한줄평 한 건. MyBook당 최대 1개라 목록이 아니라 단건 블록이다.
 * 없음·로딩·에러는 호출부(view)가 EmptyState/Skeleton으로 맡는다.
 */
export function MyBookReviewCard({ review, renderActions }: MyBookReviewCardProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs leading-[1.4] font-medium text-muted-foreground">
          {review.isPublic ? (
            <GlobeIcon size={16} strokeWidth={2} aria-hidden />
          ) : (
            <LockIcon size={16} strokeWidth={2} aria-hidden />
          )}
          <span>{review.isPublic ? "공개" : "비공개"}</span>
          <span aria-hidden>·</span>
          <span>{review.createdAt}</span>
        </div>

        {renderActions ? (
          <div className="flex shrink-0 items-center gap-1">
            {renderActions(review)}
          </div>
        ) : null}
      </div>

      <p className="rounded-xl bg-muted p-4 text-sm leading-[1.6] whitespace-pre-line text-foreground">
        {review.review}
      </p>

      <div className="flex items-center gap-3 text-xs leading-[1.4] font-medium text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <HeartIcon size={16} strokeWidth={2} aria-hidden />
          <span className="font-mono">{review.counts.like}</span>
          <span className="sr-only">명이 좋아함</span>
        </span>
        <span className="inline-flex items-center gap-1">
          <MessageCircleIcon size={16} strokeWidth={2} aria-hidden />
          <span className="font-mono">{review.counts.comment}</span>
          <span className="sr-only">개의 댓글</span>
        </span>
      </div>
    </div>
  );
}
