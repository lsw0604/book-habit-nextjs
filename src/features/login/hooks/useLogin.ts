"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { userQueryKeys } from "@/entities/user";
import { APIError, resetAuthState } from "@/shared/api";
import { toSafeRedirectPath } from "@/shared/lib";

import { loginService } from "../api";
import type { LoginRequestDTO } from "../api";

/**
 * 로그인 후 이동할 경로를 URL에서 읽는다.
 *
 * `useSearchParams`를 쓰지 않는다. 프리렌더된 라우트에서 그 훅을 호출하면
 * 가장 가까운 Suspense 경계까지가 클라이언트 렌더링으로 떨어져서,
 * `(auth)` 그룹을 정적으로 유지하려는 의도와 어긋난다. 이 값은 제출 시점에만
 * 필요하므로 그때 `window.location`에서 읽으면 충분하다.
 */
const readRedirectTo = (): string => {
  const raw = new URLSearchParams(window.location.search).get("redirectTo");
  return toSafeRedirectPath(raw);
};

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<Awaited<ReturnType<typeof loginService.login>>, APIError, LoginRequestDTO>({
    mutationFn: (body) => loginService.login(body),

    onSuccess: (data) => {
      // 이전 세션이 만료로 끝났다면 인터셉터가 갱신을 막아둔 상태다. 풀어준다.
      resetAuthState();

      // 로그인 응답이 `GET /auth/me`와 같은 형태라 캐시에 그대로 심는다.
      // 그래야 이동 직후 세션을 다시 물어보지 않는다.
      queryClient.setQueryData(userQueryKeys.me.queryKey, data);

      router.replace(readRedirectTo());
    },
  });
};
