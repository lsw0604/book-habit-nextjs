import { z } from "zod";

import { BOOK_SEARCH_MAX_SIZE, BOOK_SEARCH_MIN_SIZE } from "../constants";

import { Sort, Target } from "./search-book.model";

export const searchBookParamsSchema = z.object({
  query: z.string().default(""),
  size: z.coerce
    .number()
    .min(BOOK_SEARCH_MIN_SIZE)
    .max(BOOK_SEARCH_MAX_SIZE)
    .catch(BOOK_SEARCH_MIN_SIZE),
  sort: z.nativeEnum(Sort).catch(Sort.ACCURACY),
  target: z.nativeEnum(Target).catch(Target.TITLE),
});

export type SearchBookParams = z.infer<typeof searchBookParamsSchema>;

export const DEFAULT_SEARCH_BOOK_PARAMS: SearchBookParams = {
  query: "",
  size: BOOK_SEARCH_MIN_SIZE,
  sort: Sort.ACCURACY,
  target: Target.TITLE,
};
