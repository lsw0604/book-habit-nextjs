/** `GET /api/my-book-review` 목록 아이템의 책 정보(`MyBookReviewListBookDto`). */
export interface MyBookReviewListBookDTO {
  title: string;
  thumbnail: string | null;
}

/** 연관 데이터 개수(`MyBookReviewCountDto`). */
export interface MyBookReviewCountDTO {
  reviewLike: number;
  reviewComment: number;
}

/** `GET /api/my-book-review`·`/liked`·`/commented` 공통 목록 아이템(`MyBookReviewListItemDto`). */
export interface MyBookReviewListItemDTO {
  id: number;
  myBookId: number;
  review: string;
  isPublic: boolean;
  createdAt: string;
  book: MyBookReviewListBookDTO;
  _count: MyBookReviewCountDTO;
}

/** `GET /api/my-book-review`·`/liked`·`/commented` 공통 쿼리 파라미터. */
export interface MyBookReviewListParamsDTO {
  page?: number;
  limit?: number;
}

/** `GET /api/my-book-review/{id}`(`MyBookReviewResponseDto`). 목록과 달리 `book`이 없다. */
export interface MyBookReviewDetailDTO {
  id: number;
  myBookId: number;
  review: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  _count: MyBookReviewCountDTO;
}
