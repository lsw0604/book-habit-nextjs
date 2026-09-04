"use client";

import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";

import type { BookSummary } from "@/entities/book";
import type { APIError } from "@/shared/api";

import { searchBookQueryKeys, searchBookService } from "../api";
import type { SearchBookDTO } from "../api";
import { selectBookSummaries } from "../lib";
import type { SearchBookParams } from "../model";

const INITIAL_PAGE = 1;

export const useSearchBook = (params: SearchBookParams) => {
  const { search } = searchBookService;

  return useInfiniteQuery<
    SearchBookDTO,
    APIError,
    BookSummary[],
    ReturnType<typeof searchBookQueryKeys.list>["queryKey"],
    number
  >({
    queryKey: searchBookQueryKeys.list(params).queryKey,
    queryFn: ({ pageParam }) => search({ ...params, page: pageParam }),
    initialPageParam: INITIAL_PAGE,
    getNextPageParam: (response, allPage) => {
      const nextPage = allPage.length + 1;
      return response.meta.hasNextPage ? nextPage : undefined;
    },
    select: selectBookSummaries,
    /**
     * 검색어 없이 부르면 BE가 400을 낸다. 훅은 조건부로 호출할 수 없어서
     * 호출부의 early return으로는 못 막는다 — 렌더링만 건너뛸 뿐 fetch는 이미
     * 나간 뒤다. 필터를 바꿀 때마다 queryKey가 새로 생기므로, 이게 없으면
     * 검색어가 비어 있는 동안 옵션을 건드릴 때마다 실패 요청이 반복된다.
     *
     * `enabled`가 false면 `isPending`이 true로 유지되므로, 호출부는 반드시
     * **`isPending`보다 먼저** 검색어 없음을 걸러야 한다. 순서가 바뀌면
     * 검색 전 화면에 스켈레톤이 영원히 돈다.
     */
    enabled: Boolean(params.query),
    /**
     * 필터를 바꾸면 queryKey가 통째로 바뀌어 캐시가 비고, 그대로 두면 보고 있던
     * 목록이 사라졌다가 스켈레톤을 거쳐 다시 나타난다. 필터는 즉시 반영되므로
     * 이 깜빡임이 조작할 때마다 생긴다.
     *
     * 이전 결과를 남겨두면 목록이 제자리를 지키고, 호출부는 `isPlaceholderData`로
     * "갱신 중"만 흐리게 표시하면 된다.
     */
    placeholderData: keepPreviousData,
  });
};
