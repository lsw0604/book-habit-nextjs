"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { setAuthTransitionHandlers, userQueryKeys } from "@/entities/user";
import { resetAuthState } from "@/shared/api";
import { toSafeRedirectPath } from "@/shared/lib";

import {
  DEFAULT_AUTHENTICATED_ROUTE,
  DEFAULT_UNAUTHENTICATED_ROUTE,
  isAuthRoute,
  SESSION_EXPIRED_PARAM,
} from "../../_config";

/**
 * 인증 상태 전환을 한곳에서 처리한다.
 *
 * 알림은 여러 곳에서 온다 — 로그인·회원가입은 `features`가, 세션 만료는
 * `api-provider`가 알린다. 둘 다 라우팅이나 쿼리 캐시를 알면 안 되므로
 * "무슨 일이 일어났다"만 알리고, 무엇을 할지는 여기서 정한다. 그 연결은
 * `entities/user`의 `auth-transition`이 맡는다.
 *
 * 현재 경로와 쿼리는 `usePathname`/`useSearchParams`로 읽지 않는다. 이 훅은
 * 루트 근처에 마운트되는데, 프리렌더된 라우트에서 `useSearchParams`를 호출하면
 * 가장 가까운 Suspense 경계까지가 클라이언트 렌더링으로 떨어진다. 루트에는 그
 * 경계가 없어 앱 전체가 영향을 받는다. 핸들러는 전환이 일어난 시점에만
 * 실행되므로 그때 `window.location`을 읽으면 충분하다.
 *
 * ## 왜 `router.replace`가 아니라 `window.location.replace`인가
 *
 * 이동 전후로 **쿠키가 바뀌기 때문**이다. App Router의 클라이언트 라우터 캐시에는
 * 직전 세션 상태로 받아 둔 RSC 페이로드가 남아 있고, 거기에는 `proxy.ts`가 내준
 * **리다이렉트 결과까지 들어간다.** 그래서 소프트 내비게이션은 새 쿠키로 서버에
 * 다시 묻지 않고 옛 판정을 그대로 재생한다.
 *
 * 실측한 재현 경로다.
 * 1. 로그아웃 상태로 `/library` 링크를 누른다 → `proxy`가 `/login?redirectTo=/library`로 돌린다
 * 2. 로그인에 성공해 쿠키가 심긴다
 * 3. `router.replace("/library")` → **네트워크 요청 없이** 1번의 리다이렉트가 재생되어
 *    `/login?redirectTo=/library`에 그대로 머문다
 *
 * `/login`을 새 문서로 직접 열었을 때는 캐시가 비어 있어 잘 되기 때문에, 링크를
 * 타고 들어온 경우에만 재현되어 더 헷갈렸다. `router.refresh()`로 캐시를 무효화하는
 * 우회도 되지만 그건 *현재* 라우트만 확실히 갱신하는 API라 목적지 항목까지 지워질지는
 * 보장되지 않는다. 인증 전환은 세션당 한 번뿐이고 서버 트리 전체가 다른 사용자로
 * 바뀌는 시점이라, 문서를 새로 받는 쪽이 싸고 확실하다. `next/navigation` 의존도
 * 사라져 `docs/portability.md`에도 맞는다.
 *
 * TODO: 토스트 알림 연결
 */
export const useAuthProvider = () => {
  const queryClient = useQueryClient();

  useEffect(
    () =>
      setAuthTransitionHandlers({
        /** 로그인·회원가입 성공. 세션이 새로 생겼다. */
        onAuthenticated: () => {
          // 이전 세션이 만료로 끝났다면 인터셉터가 갱신을 막아둔 상태다. 풀어준다.
          resetAuthState();

          const { pathname, search } = window.location;

          // 로그인 화면이 아닌 곳에서 인증됐다면(예: 모달 로그인) 그대로 둔다.
          // 이동하지 않으니 캐시는 여기서 직접 손봐야 한다 — 아래 이동 경로는
          // 문서를 새로 받아오므로 쿼리 캐시가 통째로 다시 만들어진다.
          //
          // 로그인 응답으로 캐시를 재구성하지 않고 무효화만 하는 이유는, 서버가
          // 준 데이터로만 채워야 응답 형태가 갈라져도 캐시가 거짓말하지 않기
          // 때문이다.
          if (!isAuthRoute(pathname)) {
            void queryClient.invalidateQueries({
              queryKey: userQueryKeys.me.queryKey,
            });
            return;
          }

          const redirectTo = new URLSearchParams(search).get("redirectTo");
          window.location.replace(
            toSafeRedirectPath(redirectTo, DEFAULT_AUTHENTICATED_ROUTE),
          );
        },

        /** 사용자가 스스로 로그아웃했다. */
        onLoggedOut: () => {
          // 문서가 새로 뜨기 전까지의 짧은 틈에도 이전 사용자의 데이터가 화면에
          // 남으면 안 된다. 다른 사용자로 이어 로그인할 수 있으므로 통째로 비운다.
          queryClient.clear();
          resetAuthState();
          window.location.replace(DEFAULT_UNAUTHENTICATED_ROUTE);
        },

        /** 토큰 갱신까지 실패해 세션이 끝났다. */
        onSessionExpired: () => {
          queryClient.clear();

          const { pathname, search } = window.location;

          // 이미 로그인 화면이면 다시 보내지 않는다(리다이렉트 루프 방지).
          if (isAuthRoute(pathname)) return;

          // 만료 표시를 함께 싣는다. 이게 없으면 `proxy`가 남아 있는 죽은 쿠키를
          // 세션으로 읽고 `redirectTo`로 되돌려 보내 루프가 된다(`routes.ts` 참고).
          const target = new URL(
            DEFAULT_UNAUTHENTICATED_ROUTE,
            window.location.origin,
          );
          target.searchParams.set("redirectTo", `${pathname}${search}`);
          target.searchParams.set(SESSION_EXPIRED_PARAM, "1");
          window.location.replace(`${target.pathname}${target.search}`);
        },
      }),
    [queryClient],
  );
};
