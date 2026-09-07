"use client";

import { skipToken, useQuery } from "@tanstack/react-query";

import type { APIError } from "@/shared/api";

import { type AccessDTO, userQueryKeys } from "../api";
import { toUserViewModel } from "../lib/user.mapper";
import type { User } from "../model";

/**
 * 캐시에 이미 있는 세션만 읽는다. **요청을 보내지 않는다.**
 *
 * `useSession`과 나눠 둔 이유는 비로그인 사용자 때문이다. 공개 화면에서
 * `useSession`을 부르면 `/auth/me`가 401을 받고, 인터셉터가 토큰 갱신까지
 * 실패한 끝에 `auth:session-expired`를 발행한다. 그 핸들러는 캐시를 비우고
 * 로그인 화면으로 보내므로, **구경만 하던 비로그인 사용자가 로그인 화면으로
 * 튕긴다.** "로그인했나?"를 묻는 것만으로 로그아웃 절차가 도는 셈이다.
 *
 * 물어볼 필요도 없다 — `(main)` 레이아웃이 서버에서 세션을 미리 받아 캐시에
 * 심어 내려보낸다(`dehydrate`는 성공한 쿼리만 담으므로 비로그인은 빈 캐시로
 * 내려온다). 그래서 `skipToken`으로 조회를 끄고 그 결과만 구독하면 충분하다.
 * `getQueryData`와 달리 구독이라, 로그인·로그아웃으로 캐시가 바뀌면 다시 렌더된다.
 *
 * 세션이 **필요한** 화면(내 정보 표시 등)은 여전히 `useSession`을 쓴다.
 */
export const useCachedSession = () => {
  const { data } = useQuery<AccessDTO, APIError, User>({
    queryKey: userQueryKeys.me.queryKey,
    queryFn: skipToken,
    select: (response) => toUserViewModel(response.user),
  });

  return { user: data ?? null, isAuthenticated: data !== undefined };
};
