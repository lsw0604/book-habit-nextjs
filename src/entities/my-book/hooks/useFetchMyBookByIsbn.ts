"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { APIError } from "@/shared/api";

import { myBookQueryKeys, myBookService, type MyBookDetailDTO } from "../api";
import { toMyBookDetailViewModel } from "../lib";
import type { MyBookDetail } from "../model";

/**
 * ISBN으로 서재 등록 여부를 조회한다. `id`를 모르는 화면(검색 결과·책 상세)에서
 * "담기 / 이미 담음"을 가르는 값이다.
 *
 * **`null`은 실패가 아니라 "아직 안 담음"이다.** 호출부는 `isError`가 아니라
 * `data === null`로 판단해야 한다 — 처음 담는 책은 전부 이 경로로 들어온다.
 */
export const useFetchMyBookByIsbn = (isbn: string) => {
  const { fetchMyBookByIsbn } = myBookService;
  const queryClient = useQueryClient();

  return useQuery<MyBookDetailDTO | null, APIError, MyBookDetail | null>({
    queryKey: myBookQueryKeys.byIsbn(isbn).queryKey,
    queryFn: async () => {
      const myBook = await fetchMyBookByIsbn(isbn);
      if (myBook) {
        queryClient.setQueryData(
          myBookQueryKeys.detail(myBook.id).queryKey,
          myBook,
        );
      }
      return myBook;
    },
    select: (dto) => (dto ? toMyBookDetailViewModel(dto) : null),
    enabled: isbn.length > 0,
  });
};
