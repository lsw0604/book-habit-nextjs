import type { RecentBook } from "../model";

export const RECENT_BOOKS_STORAGE_KEY = "book-habit:recent-books";
export const MAX_RECENT_BOOKS = 5;

/**
 * 저장 형식이 바뀌거나 사용자가 값을 손댔을 수 있다. 최소한의 모양만 확인하고
 * 어긋나는 항목은 버린다 — 옛 데이터 하나 때문에 화면이 깨지면 안 된다.
 */
export function isRecentBook(value: unknown): value is RecentBook {
  if (typeof value !== "object" || value === null) return false;

  const book = value as Partial<RecentBook>;
  return (
    typeof book.title === "string" && typeof book.identifier?.value === "string"
  );
}
