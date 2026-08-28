"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { authEvents, userQueryKeys } from "@/entities/user";
import { resetAuthState } from "@/shared/api";
import { toSafeRedirectPath } from "@/shared/lib";

import {
  DEFAULT_AUTHENTICATED_ROUTE,
  DEFAULT_UNAUTHENTICATED_ROUTE,
  isAuthRoute,
} from "../../_config";

/**
 * 인증 상태 전환을 한곳에서 처리한다.
 *
 * 발행은 여러 레이어에서 일어난다 — 세션 만료는 `shared`의 인터셉터가,
 * 로그인은 `features`가 알린다. 둘 다 라우팅이나 쿼리 캐시를 알면 안 되므로
 * "무슨 일이 일어났다"만 발행하고, 무엇을 할지는 여기서 정한다.
 *
 * 현재 경로와 쿼리는 `usePathname`/`useSearchParams`로 읽지 않는다. 이 훅은
 * 루트 근처에 마운트되는데, 프리렌더된 라우트에서 `useSearchParams`를 호출하면
 * 가장 가까운 Suspense 경계까지가 클라이언트 렌더링으로 떨어진다. 루트에는 그
 * 경계가 없어 앱 전체가 영향을 받는다. 핸들러는 이벤트가 발생한 시점에만
 * 실행되므로 그때 `window.location`을 읽으면 충분하다.
 *
 * TODO: 토스트 알림 연결
 */
export const useAuthProvider = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    /** 로그인·회원가입 성공. 세션이 새로 생겼다. */
    const handleAuthenticated = () => {
      // 이전 세션이 만료로 끝났다면 인터셉터가 갱신을 막아둔 상태다. 풀어준다.
      resetAuthState();

      // 로그인 응답으로 캐시를 직접 재구성하지 않는다. 세션 쿼리를 무효화해
      // 서버가 준 데이터로만 채워야 응답 형태가 갈라져도 캐시가 거짓말하지 않는다.
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.me.queryKey });

      const { pathname, search } = window.location;

      // 로그인 화면이 아닌 곳에서 인증됐다면(예: 모달 로그인) 그대로 둔다.
      if (!isAuthRoute(pathname)) return;

      const redirectTo = new URLSearchParams(search).get("redirectTo");
      router.replace(
        toSafeRedirectPath(redirectTo, DEFAULT_AUTHENTICATED_ROUTE),
      );
    };

    /** 사용자가 스스로 로그아웃했다. */
    const handleLoggedOut = () => {
      // 다른 사용자로 이어 로그인할 수 있으므로 서버 상태 캐시 전체를 비운다.
      queryClient.clear();
      resetAuthState();
      router.replace(DEFAULT_UNAUTHENTICATED_ROUTE);
    };

    /** 토큰 갱신까지 실패해 세션이 끝났다. */
    const handleSessionExpired = () => {
      queryClient.clear();

      const { pathname, search } = window.location;

      // 이미 로그인 화면이면 다시 보내지 않는다(리다이렉트 루프 방지).
      if (isAuthRoute(pathname)) return;

      const redirectTo = encodeURIComponent(`${pathname}${search}`);
      router.replace(`${DEFAULT_UNAUTHENTICATED_ROUTE}?redirectTo=${redirectTo}`);
    };

    const unsubscribes = [
      authEvents.on("auth:authenticated", handleAuthenticated),
      authEvents.on("auth:logged-out", handleLoggedOut),
      authEvents.on("auth:session-expired", handleSessionExpired),
    ];

    return () => unsubscribes.forEach((off) => off());
  }, [router, queryClient]);
};
