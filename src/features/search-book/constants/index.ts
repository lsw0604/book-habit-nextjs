import { Target } from "../model";

export const BOOK_SEARCH_MIN_SIZE = 10;
export const BOOK_SEARCH_MAX_SIZE = 50;

export const BOOK_SEARCH_SELECT_OPTIONS = [
  { label: "제목", value: Target.TITLE },
  { label: "ISBN", value: Target.ISBN },
  { label: "작가", value: Target.PERSON },
  { label: "출판사", value: Target.PUBLISHER },
] as const;
