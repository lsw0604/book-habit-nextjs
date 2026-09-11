import type { MyBookStatus } from "../model";

/** `GET /api/my-book` 목록 아이템의 책 정보(`MyBookListItemBookDto`). */
export interface MyBookListItemBookDTO {
  title: string;
  thumbnail: string | null;
  totalPage: number | null;
}

/** `GET /api/my-book` 목록 아이템(`MyBookListItemDto`). */
export interface MyBookListItemDTO {
  id: number;
  status: MyBookStatus;
  rating: number;
  currentPage: number;
  readCount: number;
  book: MyBookListItemBookDTO;
}

/** `GET /api/my-book` 쿼리 파라미터. */
export interface MyBookListParamsDTO {
  status?: MyBookStatus;
  minRating?: number;
  hasReview?: boolean;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

/** `GET /api/my-book/{id}`의 책 정보(`MyBookDetailBookDto`). 목록보다 훨씬 넓다. */
export interface MyBookDetailBookDTO {
  title: string;
  subTitle: string | null;
  isbn: string;
  authors: string[];
  translators: string[];
  publisher: string | null;
  thumbnail: string | null;
  coverImage: string | null;
  description: string | null;
  url: string | null;
  pubDate: string | null;
  totalPage: number | null;
  stockStatus: string | null;
}

export interface MyBookCountDTO {
  readingLog: number;
  review: number;
}

/** `GET /api/my-book/{id}`(`MyBookResponseDto`). */
export interface MyBookDetailDTO {
  id: number;
  status: MyBookStatus;
  rating: number;
  currentPage: number;
  readCount: number;
  startedAt: string | null;
  finishedAt: string | null;
  lastReadAt: string | null;
  createdAt: string;
  updatedAt: string;
  book: MyBookDetailBookDTO;
  _count: MyBookCountDTO;
}
