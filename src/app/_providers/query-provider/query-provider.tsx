"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { ReactNode } from "react";

import { getQueryClient } from "@/shared/api";

/**
 * `getQueryClient()`는 브라우저에서 싱글턴을 돌려주므로 `useState`로 감쌀 필요가 없다.
 * 서버에서는 요청마다 새 인스턴스가 만들어져 요청 간 캐시가 섞이지 않는다.
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
