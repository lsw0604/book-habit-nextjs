import { QueryClient, isServer } from "@tanstack/react-query";

import { isAPIError } from "../types";

/** 서버에서 프리페치한 데이터를 클라이언트가 곧바로 다시 받아오지 않을 만큼의 시간. */
const DEFAULT_STALE_TIME_MS = 60_000;

/** TanStack Query 기본값과 같다. 4xx만 예외로 빼고 나머지는 그대로 둔다. */
const MAX_RETRY_COUNT = 3;

const HTTP_CLIENT_ERROR_MIN = 400;
const HTTP_CLIENT_ERROR_MAX = 500;

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // staleTime이 0이면 하이드레이션 직후 클라이언트가 곧바로 refetch한다.
        // 서버에서 미리 받아온 의미가 사라지므로 반드시 0보다 커야 한다.
        staleTime: DEFAULT_STALE_TIME_MS,
        /**
         * 4xx는 재시도해도 같은 답이 온다. 기본값(3회)이면 잘못된 요청 하나가
         * 네 번 나가고 에러 화면도 그만큼 늦게 뜬다.
         *
         * 응답을 못 받은 실패(`network`·`timeout`)는 `statusCode`가 0이라 이
         * 범위 밖이고, 그쪽은 재시도가 통할 수 있으므로 기본 횟수를 유지한다.
         */
        retry: (failureCount, error) => {
          if (isAPIError(error)) {
            if (error.isCanceled) return false;
            if (
              error.statusCode >= HTTP_CLIENT_ERROR_MIN &&
              error.statusCode < HTTP_CLIENT_ERROR_MAX
            ) {
              return false;
            }
          }

          return failureCount < MAX_RETRY_COUNT;
        },
      },
    },
  });

let browserQueryClient: QueryClient | undefined;

/**
 * 서버에서는 요청마다 새로 만들고, 브라우저에서는 하나를 재사용한다.
 *
 * 서버에서 싱글턴을 쓰면 요청 간에 캐시가 공유되어 **다른 사용자의 데이터가
 * 새어 나간다.** 반대로 브라우저에서 매번 새로 만들면 캐시가 유지되지 않는다.
 */
export const getQueryClient = (): QueryClient => {
  if (isServer) return makeQueryClient();

  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
};
