/**
 * BE 엔드포인트 경로. 명세(http://localhost:3000/api-json)의 31개 경로와 1:1로 맞춘다.
 *
 * 식별자가 들어가는 경로는 함수로 둔다.
 */
export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: "/api/auth/signup",
    LOGIN: "/api/auth/login",
    KAKAO_CALLBACK: "/api/auth/kakao/callback",
    REFRESH: "/api/auth/refresh",
    ME: "/api/auth/me",
    LOGOUT: "/api/auth/logout",
  },
  USER: {
    ROOT: "/api/user",
    BY_ID: (id: number) => `/api/user/${id}`,
  },
  /** 카카오 검색(자유 텍스트) + 알라딘 ISBN 단건 조회 */
  BOOK: {
    SEARCH: "/api/books",
    DETAIL: (isbn: string) => `/api/books/detail/${isbn}`,
  },
  MY_BOOK: {
    ROOT: "/api/my-book",
    BY_ID: (id: number) => `/api/my-book/${id}`,
  },
  READING_LOG: {
    ROOT: "/api/reading-log",
    BY_ID: (id: number) => `/api/reading-log/${id}`,
  },
  MY_BOOK_REVIEW: {
    ROOT: "/api/my-book-review",
    LIKED: "/api/my-book-review/liked",
    COMMENTED: "/api/my-book-review/commented",
    BY_ID: (id: number) => `/api/my-book-review/${id}`,
  },
  /** 생성·삭제 모두 `myBookReviewId`로 대상을 지정한다 (삭제는 쿼리). */
  REVIEW_LIKE: {
    ROOT: "/api/review-like",
  },
  REVIEW_COMMENT: {
    ROOT: "/api/review-comment",
    BY_ID: (id: number) => `/api/review-comment/${id}`,
  },
  /** 비로그인 조회 가능 */
  PUBLIC_REVIEW: {
    ROOT: "/api/public-review",
    BY_ID: (id: number) => `/api/public-review/${id}`,
  },
  /** 자유 텍스트 자동완성(초성 매칭 지원) */
  TAG: {
    ROOT: "/api/tag",
  },
  MY_BOOK_TAG: {
    ROOT: "/api/my-book-tag",
    BY_ID: (id: number) => `/api/my-book-tag/${id}`,
  },
  QUOTE: {
    ROOT: "/api/quote",
    BY_ID: (id: number) => `/api/quote/${id}`,
  },
  READING_GOAL: {
    ROOT: "/api/reading-goal",
    BY_ID: (id: number) => `/api/reading-goal/${id}`,
  },
  HEALTH: "/api/health",
} as const;
