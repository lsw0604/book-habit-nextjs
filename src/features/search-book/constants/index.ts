import { Sort, Target } from "../model";

export const BOOK_SEARCH_SORT_OPTIONS = [
  { label: "정확도순", value: Sort.ACCURACY },
  { label: "최신순", value: Sort.LATEST },
] as const;

export const BOOK_SEARCH_TARGET_OPTIONS = [
  { label: "제목", value: Target.TITLE },
  { label: "ISBN", value: Target.ISBN },
  { label: "작가", value: Target.PERSON },
  { label: "출판사", value: Target.PUBLISHER },
] as const;

export const BOOK_SEARCH_SIZE_OPTIONS = [
  { label: "10개", value: 10 },
  { label: "20개", value: 20 },
  { label: "30개", value: 30 },
  { label: "40개", value: 40 },
  { label: "50개", value: 50 },
] as const;
