"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import {
  API_ENDPOINTS,
  apiAxiosInstance,
  authClient,
  resetAuthState,
  setupApiResponseInterceptor,
} from "@/shared/api";

const LOGIN_PATH = "/login";

/**
 * 세션 만료 처리기를 담아두는 자리.
 *
 * 인터셉터는 모듈 로드 시점에 한 번만 등록하는데, 그때는 `router`도
 * `queryClient`도 없다. 실제 처리는 마운트 후 {@link ApiProvider}가 채워 넣는다.
 */
const sessionExpiredHandler: { current: (() => void) | null } = {
  current: null,
};

/*
 * 인터셉터를 모듈 스코프에서 등록한다.
 *
 * 모듈 본문은 import 시점에 실행되므로 어떤 컴포넌트 렌더보다도 먼저다.
 * effect에서 등록하면 늦다 — React는 effect를 자식 → 부모 순서로 실행하고,
 * axios는 요청을 보내는 시점에 존재하는 인터셉터만 적용하기 때문에
 * 자식이 먼저 보낸 요청은 갱신 없이 401로 끝난다.
 *
 * 서버에서는 등록하지 않는다. 인터셉터가 하는 일이 전부 브라우저 동작이고,
 * 서버 컴포넌트는 `withServerAuth`로 쿠키를 직접 전달하기 때문이다.
 */
if (typeof window !== "undefined") {
  setupApiResponseInterceptor(apiAxiosInstance, {
    refreshFn: () => authClient.post(API_ENDPOINTS.AUTH.REFRESH),
    onRefreshFailed: () => sessionExpiredHandler.current?.(),
  });
}

/** `apiClient`의 401 자동 갱신이 실패했을 때 로그인 화면으로 보낸다. */
export function ApiProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    /**
     * 세션이 끝났을 때 비워야 하는 클라이언트 상태를 한곳에 모은다.
     *
     * 전체 리로드가 아니라 `router.replace`를 쓰므로 클라이언트 상태가 그대로
     * 살아남는다. 이전 사용자 데이터가 남지 않게 하려면 여기에서 전부 비워야
     * 하고, **클라이언트 상태가 늘 때마다 여기에 추가해야 한다.**
     */
    const clearClientSession = () => {
      queryClient.clear();
      resetAuthState();
    };

    // 현재 경로는 `usePathname`/`useSearchParams`로 읽지 않는다.
    // 프리렌더된 라우트에서 `useSearchParams`를 쓰면 가장 가까운 Suspense
    // 경계까지가 클라이언트 렌더링으로 떨어지는데, 루트에는 그 경계가 없어
    // 앱 전체가 영향을 받는다. 이 콜백은 401이 났을 때만 실행되므로
    // 그 시점에 `window.location`을 읽으면 충분하다.
    sessionExpiredHandler.current = () => {
      clearClientSession();

      const { pathname, search } = window.location;

      // 이미 로그인 화면이면 다시 보내지 않는다 (리다이렉트 루프 방지)
      if (pathname === LOGIN_PATH) return;

      const redirectTo = encodeURIComponent(`${pathname}${search}`);
      router.replace(`${LOGIN_PATH}?redirectTo=${redirectTo}`);
    };

    return () => {
      sessionExpiredHandler.current = null;
    };
  }, [router, queryClient]);

  return <>{children}</>;
}
