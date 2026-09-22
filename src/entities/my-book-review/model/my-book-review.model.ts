/** 한줄평 목록 한 줄(내가 쓴/좋아요한/댓글단 목록 공통). */
export interface MyBookReviewSummary {
  id: number;
  myBookId: number;
  review: string;
  isPublic: boolean;
  createdAt: string;
  title: string;
  thumbnail: string | null;
  counts: { like: number; comment: number };
}

/** 한줄평 단건 상세. 목록과 달리 책 정보가 없다(BE가 이미 MyBook 맥락 안에서 조회한다고 본다). */
export interface MyBookReviewDetail {
  id: number;
  myBookId: number;
  review: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  counts: { like: number; comment: number };
}
