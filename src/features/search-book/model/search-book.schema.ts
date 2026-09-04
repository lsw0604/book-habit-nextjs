import { z } from "zod";

import { Sort, Target } from "./search-book.model";

/** size 허용 범위와 기본값. 이 스키마에서만 쓰여서 여기 둔다. */
const BOOK_SEARCH_MIN_SIZE = 10;
const BOOK_SEARCH_MAX_SIZE = 50;

export const searchBookParamsSchema = z.object({
  // trim이 없으면 `?query=%20%20`(공백만) 같은 URL이 "검색어 있음"으로 통과해
  // 빈 검색 요청이 나간다.
  query: z.string().trim().default(""),
  size: z.coerce
    .number()
    .min(BOOK_SEARCH_MIN_SIZE)
    .max(BOOK_SEARCH_MAX_SIZE)
    .catch(BOOK_SEARCH_MIN_SIZE),
  sort: z.enum(Sort).catch(Sort.ACCURACY),
  target: z.enum(Target).catch(Target.TITLE),
});

export type SearchBookParams = z.infer<typeof searchBookParamsSchema>;

export const DEFAULT_SEARCH_BOOK_PARAMS: SearchBookParams = {
  query: "",
  size: BOOK_SEARCH_MIN_SIZE,
  sort: Sort.ACCURACY,
  target: Target.TITLE,
};
