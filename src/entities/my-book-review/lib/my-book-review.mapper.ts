import type { MyBookReviewDetailDTO, MyBookReviewListItemDTO } from "../api";
import type { MyBookReviewDetail, MyBookReviewSummary } from "../model";
import { formatMyBookReviewDate } from "./my-book-review.formatter";

export const toMyBookReviewSummaryViewModel = (
  dto: MyBookReviewListItemDTO,
): MyBookReviewSummary => ({
  id: dto.id,
  myBookId: dto.myBookId,
  review: dto.review,
  isPublic: dto.isPublic,
  createdAt: formatMyBookReviewDate(dto.createdAt),
  title: dto.book.title,
  thumbnail: dto.book.thumbnail,
  counts: { like: dto._count.reviewLike, comment: dto._count.reviewComment },
});

export const toMyBookReviewDetailViewModel = (
  dto: MyBookReviewDetailDTO,
): MyBookReviewDetail => ({
  id: dto.id,
  myBookId: dto.myBookId,
  review: dto.review,
  isPublic: dto.isPublic,
  createdAt: formatMyBookReviewDate(dto.createdAt),
  updatedAt: formatMyBookReviewDate(dto.updatedAt),
  counts: { like: dto._count.reviewLike, comment: dto._count.reviewComment },
});
