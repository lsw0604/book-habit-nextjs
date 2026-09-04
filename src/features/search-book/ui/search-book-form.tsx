"use client";

import { usePathname, useRouter } from "next/navigation";
import { FormProvider } from "react-hook-form";

import { useQueryParams } from "@/shared/hooks";

import { useSearchBookForm } from "../hooks";
import { buildSearchBookUrl } from "../lib";
import { DEFAULT_SEARCH_BOOK_PARAMS, searchBookParamsSchema } from "../model";
import type { SearchBookParams } from "../model";

import { SearchBookFilterSummary } from "./search-book-filter-summary";
import { SearchBookPopover } from "./search-book-popover";
import { SearchBookQueryInput } from "./search-book-query-input";

/**
 * 검색 폼의 조립과 **라우팅 정책**을 소유한다. 자식들은 "값이 바뀌었다"만 알리고,
 * 그걸 URL에 어떻게 반영할지(push인지 replace인지, 어느 경로로)는 전부 여기서 정한다.
 * 두 정책을 나란히 둬야 왜 서로 다른지가 한눈에 보인다.
 */
export function SearchBookForm() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useQueryParams(
    searchBookParamsSchema,
    DEFAULT_SEARCH_BOOK_PARAMS,
  );
  const methods = useSearchBookForm(params);

  /**
   * 새 검색어 제출은 별개의 탐색 행위라 목록으로 `push`한다 — 뒤로가기로 이전
   * 검색어에 돌아갈 수 있어야 하고, 상세를 보던 중이었다면 결과 목록으로 나오는 게 맞다.
   */
  const search = methods.handleSubmit((data: SearchBookParams) => {
    router.push(buildSearchBookUrl(data));
  });

  /**
   * 필터는 "이동"이 아니라 지금 보고 있는 결과의 조건 수정이다. 그래서 `replace`로
   * 히스토리를 쌓지 않고(필터 3번 만지면 뒤로가기도 3번이 된다), `pathname`을 넘겨
   * `/search/[isbn]`에서 열어둔 책이 닫히지 않게 한다.
   */
  const applyFilter = methods.handleSubmit((data: SearchBookParams) => {
    router.replace(buildSearchBookUrl(data, pathname));
  });

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col gap-2">
        <form onSubmit={search} className="flex flex-row gap-4">
          <SearchBookPopover onCommit={applyFilter} />
          <SearchBookQueryInput onSearch={search} />
        </form>
        <SearchBookFilterSummary params={params} />
      </div>
    </FormProvider>
  );
}
