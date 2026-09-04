"use client";

import { SearchIcon } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

import { FormInput } from "@/shared/ui";

import type { SearchBookParams } from "../model";

interface SearchBookQueryInputProps {
  /** 검색 아이콘 클릭 시 실행. 인풋의 Enter와 같은 동작이어야 한다. */
  onSearch: () => void;
}

/**
 * 검색어 입력 필드. 폼 컨텍스트를 `useFormContext`로 받으므로 `SearchBookForm`의
 * `FormProvider` 안에서만 쓸 수 있다.
 *
 * 제출이 무엇을 하는지(어떤 경로로 push할지)는 알지 않는다 — `onSearch`를 부를 뿐이다.
 */
export function SearchBookQueryInput({ onSearch }: SearchBookQueryInputProps) {
  const { control } = useFormContext<SearchBookParams>();

  return (
    <Controller
      name="query"
      control={control}
      render={({ field }) => (
        <FormInput
          id="search-query"
          placeholder="검색어를 입력하세요."
          autoFocus
          autoComplete="off"
          icon={SearchIcon}
          iconPosition="right"
          // FormInput의 아이콘 버튼은 type="button"이라 폼을 제출하지 않는다.
          // 그래서 Enter와 같은 동작을 직접 걸어준다.
          iconLabel="검색"
          onIconClick={onSearch}
          className="md:max-w-md"
          inputClassName="text-muted-foreground"
          {...field}
        />
      )}
    />
  );
}
