"use client";

import type { ReactNode } from "react";

import {
  API_ENDPOINTS,
  apiAxiosInstance,
  authClient,
  setupApiResponseInterceptor,
} from "@/shared/api";
import { authEvents } from "@/entities/user";

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
    // 갱신은 결과가 필요한 동작이라 콜백으로 주입한다. 인터셉터가 await 하고
    // 실패를 catch해야 하는데, 이벤트는 발행하고 잊는 구조라 그걸 못 한다.
    refreshFn: () => authClient.post<void>(API_ENDPOINTS.AUTH.REFRESH),

    // 반대로 "세션이 끝났다"는 알리기만 하면 되므로 이벤트로 넘긴다.
    // 무엇을 할지(캐시 비우기·리다이렉트)는 `AuthProvider`가 정한다.
    onRefreshFailed: (reason) =>
      authEvents.emit("auth:session-expired", { reason }),
  });
}

/**
 * `apiClient`에 401 자동 갱신을 붙인다.
 *
 * 라우팅도 쿼리 캐시도 여기서 다루지 않는다. 인증 전환의 처리는 전부
 * `AuthProvider`에 모여 있다.
 */
export function ApiProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
