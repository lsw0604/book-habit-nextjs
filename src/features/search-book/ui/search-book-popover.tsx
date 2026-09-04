"use client";

import { FilterIcon } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

import { cn } from "@/shared/lib";
import {
  buttonVariants,
  FormSelect,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RadioGroup,
  RadioGroupItem,
} from "@/shared/ui";

import {
  BOOK_SEARCH_SIZE_OPTIONS,
  BOOK_SEARCH_SORT_OPTIONS,
  BOOK_SEARCH_TARGET_OPTIONS,
} from "../constants";
import type { SearchBookParams } from "../model";

/** Popover 껍데기와 그 안의 필드들이 함께 쓰는 커밋 콜백 계약. */
interface FilterCommitProps {
  /** 필터 값이 바뀔 때마다 호출된다. 반영 방식(replace)은 호출부가 정한다. */
  onCommit: () => void;
}

/**
 * 검색 필터 Popover. 폼 컨텍스트를 `useFormContext`로 받으므로 `SearchBookForm`의
 * `FormProvider` 안에서만 쓸 수 있다.
 */
export function SearchBookPopover({ onCommit }: FilterCommitProps) {
  return (
    <Popover>
      <PopoverTrigger
        aria-label="검색 필터"
        className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
      >
        <FilterIcon size={20} />
      </PopoverTrigger>
      <PopoverContent align="start" className="flex w-64 flex-col gap-4">
        <FilterFields onCommit={onCommit} />
      </PopoverContent>
    </Popover>
  );
}

/**
 * 필터는 바꾸는 즉시 반영한다. Popover 안에 "적용" 버튼을 두지 않는 대신
 * 각 컨트롤이 값 변경 직후 `onCommit`을 부른다 — `field.onChange`가 동기라
 * 이 시점엔 이미 새 값이 폼에 들어가 있다.
 */
function FilterFields({ onCommit }: FilterCommitProps) {
  const { control } = useFormContext<SearchBookParams>();

  return (
    <>
      <div className="flex flex-col gap-2">
        <Label>정렬</Label>
        <Controller
          name="sort"
          control={control}
          render={({ field: { value, onChange } }) => (
            <RadioGroup
              value={value}
              onValueChange={(next) => {
                onChange(next);
                onCommit();
              }}
            >
              {BOOK_SEARCH_SORT_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-center gap-2">
                  <RadioGroupItem
                    id={`search-book-sort-${option.value}`}
                    value={option.value}
                  />
                  <Label htmlFor={`search-book-sort-${option.value}`}>
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        />
      </div>

      <Controller
        name="target"
        control={control}
        render={({ field: { value, onChange } }) => (
          <FormSelect
            id="search-book-target"
            label="검색 대상"
            value={value}
            onChange={(next) => {
              onChange(next);
              onCommit();
            }}
            options={BOOK_SEARCH_TARGET_OPTIONS}
          />
        )}
      />

      <Controller
        name="size"
        control={control}
        render={({ field: { value, onChange } }) => (
          <FormSelect
            id="search-book-size"
            label="페이지당 결과 수"
            value={value}
            onChange={(next) => {
              onChange(next);
              onCommit();
            }}
            options={BOOK_SEARCH_SIZE_OPTIONS}
          />
        )}
      />
    </>
  );
}
