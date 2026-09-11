"use client";

import { useQuery } from "@tanstack/react-query";

import type { APIError, ResponsePagination } from "@/shared/api";

import {
  myBookQueryKeys,
  myBookService,
  type MyBookListItemDTO,
  type MyBookListParamsDTO,
} from "../api";
import { selectMyBookSummaries } from "../lib";
import type { MyBookSummary } from "../model";

/**
 * 서재 목록을 조회한다.
 *
 * `useInfiniteQuery`가 아닌 이유는 BE가 `limit` 기본값을 2000으로 두고 "개인 서재는
 * 한 번에 받는다"고 설계했기 때문이다(Swagger 설명). 페이지네이션 파라미터는 남아
 * 있으니, 나중에 서재가 커지면 그때 무한 스크롤로 바꾸면 된다.
 */
export const useFetchMyBooks = (params: MyBookListParamsDTO = {}) => {
  const { fetchMyBooks } = myBookService;

  return useQuery<
    ResponsePagination<MyBookListItemDTO>,
    APIError,
    MyBookSummary[]
  >({
    queryKey: myBookQueryKeys.list(params).queryKey,
    queryFn: () => fetchMyBooks(params),
    select: selectMyBookSummaries,
  });
};
