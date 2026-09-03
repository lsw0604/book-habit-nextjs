"use client";

import { useSearchParams } from "next/navigation";
import { z } from "zod";

/**
 * URL 쿼리를 zod 스키마로 파싱한다. 검증에 실패하면(스키마가 모든 필드를
 * `.catch()`/`.default()`로 방어해두지 않은 경우) 예외 대신 `fallback`을 돌려준다 —
 * 잘못된 쿼리 하나로 렌더링이 통째로 깨지지 않게 하기 위해서다.
 */
export const useQueryParams = <T extends z.ZodType>(
  schema: T,
  fallback: z.infer<T>,
): z.infer<T> => {
  const searchParams = useSearchParams();
  const result = schema.safeParse(Object.fromEntries(searchParams.entries()));
  return result.success ? result.data : fallback;
};
