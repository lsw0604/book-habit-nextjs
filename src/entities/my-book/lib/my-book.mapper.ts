import type { MyBookDetailDTO, MyBookListItemDTO } from "../api";
import type { MyBookDetail, MyBookSummary } from "../model";
import { formatMyBookDate, formatPageProgress } from "./my-book.formatter";

/**
 * 진행률(0~100).
 *
 * 총 페이지를 모르면 계산할 수 없으므로 `null`을 돌려준다. 0으로 채우면
 * "안 읽었다"와 "알 수 없다"가 구분되지 않는다.
 *
 * 100을 넘겨 잘라내는 이유는 실제로 넘길 수 있기 때문이다 — 알라딘의 총 페이지가
 * 판본과 다르거나, 사용자가 현재 페이지를 크게 입력할 수 있다.
 */
function toProgress(currentPage: number, totalPage: number | null): number | null {
  if (!totalPage || totalPage <= 0) return null;
  return Math.min(100, Math.round((currentPage / totalPage) * 100));
}

export const toMyBookSummaryViewModel = (
  dto: MyBookListItemDTO,
): MyBookSummary => ({
  id: dto.id,
  status: dto.status,
  rating: dto.rating,
  currentPage: dto.currentPage,
  readCount: dto.readCount,
  title: dto.book.title,
  thumbnail: dto.book.thumbnail,
  totalPage: dto.book.totalPage,
  progress: toProgress(dto.currentPage, dto.book.totalPage),
});

export const toMyBookDetailViewModel = (dto: MyBookDetailDTO): MyBookDetail => ({
  id: dto.id,
  status: dto.status,
  rating: dto.rating,
  currentPage: dto.currentPage,
  readCount: dto.readCount,
  progress: toProgress(dto.currentPage, dto.book.totalPage),
  startedAt: formatMyBookDate(dto.startedAt),
  finishedAt: formatMyBookDate(dto.finishedAt),
  lastReadAt: formatMyBookDate(dto.lastReadAt),
  pageProgressLabel: formatPageProgress(dto.currentPage, dto.book.totalPage),
  book: {
    title: dto.book.title,
    subTitle: dto.book.subTitle,
    authors: dto.book.authors,
    translators: dto.book.translators,
    publisher: dto.book.publisher,
    pubDate: formatMyBookDate(dto.book.pubDate),
    coverImage: dto.book.coverImage,
    description: dto.book.description,
    totalPage: dto.book.totalPage,
  },
  counts: {
    readingLog: dto._count.readingLog,
    review: dto._count.review,
  },
});
