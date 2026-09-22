import { GlobeIcon, HeartIcon, LockIcon, MessageCircleIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Thumbnail } from "@/shared/ui";

import type { MyBookReviewSummary } from "../model";

interface MyBookReviewListProps {
  reviews: readonly MyBookReviewSummary[];
  /** 항목 우측 액션 슬롯. `MyBookReviewCard`와 같은 이유로 entities가 자리만 비워둔다. */
  renderActions?: (review: MyBookReviewSummary) => ReactNode;
}

/**
 * 여러 책을 넘나드는 한줄평 목록(내가 쓴 전체·좋아요·댓글단 글 공통).
 * Card로 감싸지 않고 `divide-y`로 나열한다(DESIGN.md ④ — 피드는 플랫 로우).
 * 없음·로딩·에러는 호출부(view)가 EmptyState/Skeleton으로 맡는다.
 */
export function MyBookReviewList({ reviews, renderActions }: MyBookReviewListProps) {
  return (
    <ul className="divide-y divide-border">
      {reviews.map((review) => (
        <MyBookReviewListItem
          key={review.id}
          review={review}
          renderActions={renderActions}
        />
      ))}
    </ul>
  );
}

function MyBookReviewListItem({
  review,
  renderActions,
}: {
  review: MyBookReviewSummary;
  renderActions?: (review: MyBookReviewSummary) => ReactNode;
}) {
  return (
    <li className="flex gap-3 py-3">
      <div className="relative aspect-5/7 w-10 shrink-0 self-start">
        <Thumbnail
          src={review.thumbnail}
          alt={`${review.title} 표지`}
          sizes="40px"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h4 className="line-clamp-1 text-sm leading-normal font-medium text-title">
          {review.title}
        </h4>

        <p className="line-clamp-2 text-sm leading-[1.6] text-foreground">
          {review.review}
        </p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs leading-[1.4] font-medium text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            {review.isPublic ? (
              <GlobeIcon size={16} strokeWidth={2} aria-hidden />
            ) : (
              <LockIcon size={16} strokeWidth={2} aria-hidden />
            )}
            {review.createdAt}
          </span>
          <span className="inline-flex items-center gap-1">
            <HeartIcon size={16} strokeWidth={2} aria-hidden />
            <span className="font-mono">{review.counts.like}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageCircleIcon size={16} strokeWidth={2} aria-hidden />
            <span className="font-mono">{review.counts.comment}</span>
          </span>
        </div>
      </div>

      {/* self-start: 형제가 그렇듯, 얹지 않으면 flex의 기본 stretch로 늘어난다. */}
      {renderActions ? (
        <div className="flex shrink-0 items-center gap-1 self-start">
          {renderActions(review)}
        </div>
      ) : null}
    </li>
  );
}
