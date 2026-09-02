import { useInfiniteQuery } from "@tanstack/react-query";

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
  });
};
