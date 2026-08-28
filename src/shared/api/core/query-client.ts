import { QueryClient, isServer } from "@tanstack/react-query";

/** 서버에서 프리페치한 데이터를 클라이언트가 곧바로 다시 받아오지 않을 만큼의 시간. */
const DEFAULT_STALE_TIME_MS = 60_000;

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // staleTime이 0이면 하이드레이션 직후 클라이언트가 곧바로 refetch한다.
        // 서버에서 미리 받아온 의미가 사라지므로 반드시 0보다 커야 한다.
        staleTime: DEFAULT_STALE_TIME_MS,
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
