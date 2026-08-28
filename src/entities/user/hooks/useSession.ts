import { useQuery } from "@tanstack/react-query";

import type { APIError } from "@/shared/api";

import { type AccessDTO, userQueryKeys, userService } from "../api";
import { toUserViewModel } from "../lib/user.mapper";
import type { User } from "../model";

/** 네트워크·타임아웃처럼 일시적인 실패에만 재시도한다. */
const MAX_RETRY = 2;

export const useSession = () => {
  return useQuery<AccessDTO, APIError, User>({
    queryKey: userQueryKeys.me.queryKey,
    queryFn: () => userService.me(),
    select: (response) => toUserViewModel(response.user),

    // 401이면 인터셉터가 이미 토큰 갱신을 시도하고 포기한 상태다.
    // 그 위에서 기본값대로 3번 더 반복하면 실패할 요청만 늘어난다.
    // 4xx·5xx도 같은 요청을 반복해서 결과가 바뀌지 않는다.
    retry: (failureCount, error) => {
      if (error.kind === "unauthorized" || error.kind === "server") return false;
      if (error.kind === "canceled") return false;
      return failureCount < MAX_RETRY;
    },
  });
};
