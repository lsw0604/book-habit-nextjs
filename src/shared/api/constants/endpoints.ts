/**
 * BE 엔드포인트 경로. 명세(http://localhost:3000/api-json)의 32개 경로와 1:1로 맞춘다.
 * (명세의 33개 중 카카오 콜백은 FE가 호출하지 않아 상수를 두지 않는다.)
 *
 * 식별자가 들어가는 경로는 함수로 둔다.
 */
export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: "/api/auth/signup",
    LOGIN: "/api/auth/login",
    /** 백엔드가 인가·콜백을 전부 소유한다. FE는 이 경로로 <a> 링크만 건다. */
    KAKAO_AUTHORIZE: "/api/auth/kakao",
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
    /**
     * ISBN으로 내 서재 등록 여부를 묻는다. 하이픈이 있어도 되고 BE가 ISBN-13으로
     * 정규화한다. **없으면 404가 아니라 200 + `data: null`이다.**
     */
    BY_ISBN: (isbn: string) => `/api/my-book/by-isbn/${isbn}`,
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
