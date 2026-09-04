"use client";

import { useCallback, useMemo } from "react";
import { useLocalStorage } from "usehooks-ts";

import {
  isRecentBook,
  MAX_RECENT_BOOKS,
  RECENT_BOOKS_STORAGE_KEY,
} from "../lib";
import type { RecentBook } from "../model";

/**
 * 사용자가 눌러본 책을 로컬에 남기고 다시 읽는다.
 *
 * 기록 시점은 **상세 진입이 아니라 클릭**이다. "눌러봤다"는 사용자의 행동 그대로이고,
 * 상세 조회가 실패해도 눌러본 사실은 남는다. 무엇보다 effect가 필요 없어진다.
 *
 * 저장은 `usehooks-ts`의 `useLocalStorage`에 맡긴다. SSR에서 초기값을 쓰고, 같은 키를
 * 보는 다른 컴포넌트에 변경을 알려준다 — master-detail에서 목록 패널이 계속 마운트된
 * 채로 있으므로 이 동기화가 필요하다.
 */
export function useRecentBooks() {
  const [stored, setStored] = useLocalStorage<RecentBook[]>(
    RECENT_BOOKS_STORAGE_KEY,
    [],
  );

  const books = useMemo(
    () =>
      (Array.isArray(stored) ? stored.filter(isRecentBook) : []).slice(
        0,
        MAX_RECENT_BOOKS,
      ),
    [stored],
  );

  /** 같은 책을 다시 누르면 맨 앞으로 올린다. 안 그러면 한 책이 목록을 다 차지한다. */
  const trackBook = useCallback(
    (book: RecentBook) => {
      setStored((prev) => {
        const rest = (Array.isArray(prev) ? prev : []).filter(
          (item) => item.identifier.value !== book.identifier.value,
        );
        return [book, ...rest].slice(0, MAX_RECENT_BOOKS);
      });
    },
    [setStored],
  );

  /** 잘못 눌러 들어온 책을 빼낸다. 목록에서만 지울 뿐 책 데이터에는 영향이 없다. */
  const removeBook = useCallback(
    (identifierValue: string) => {
      setStored((prev) =>
        (Array.isArray(prev) ? prev : []).filter(
          (item) => item.identifier.value !== identifierValue,
        ),
      );
    },
    [setStored],
  );

  return { books, trackBook, removeBook };
}
