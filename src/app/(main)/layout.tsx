import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { AppShell } from "./_shell";

import { userQueryKeys, userService } from "@/entities/user";
import { getQueryClient } from "@/shared/api";
import { withServerAuth } from "@/shared/api/server";

/**
 * 개인화된 화면들이 속하는 그룹. 세션을 서버에서 미리 받아 캐시에 심어 내려보낸다.
 *
 * 하드 리프레시 시점에 쿠키는 이미 서버로 오는 요청에 실려 있다. 그걸 두고
 * 브라우저가 다시 `/auth/me`를 묻게 하면 왕복이 한 번 더 생기고, 그 사이
 * "로그인했는지 모르는 상태"가 화면에 노출된다. 여기서 미리 받아두면
 * `useSession`이 첫 렌더에 곧바로 값을 읽는다.
 *
 * `cookies()`를 호출하므로 이 그룹은 정적 렌더링을 하지 않는다. 서재·기록·목표처럼
 * 사용자마다 다른 화면들이라 어차피 정적일 수 없다. `/login` 같은 인증 화면은
 * 이 그룹 밖에 두어 정적으로 남긴다.
 */
export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  const queryClient = getQueryClient();

  // prefetchQuery는 실패해도 throw하지 않는다. 세션이 없으면 캐시가 빈 채로
  // 내려가고, 클라이언트의 useSession이 요청해 인터셉터가 갱신을 시도한다.
  // 서버에서는 갱신을 할 수 없다 — 레이아웃은 쿠키를 새로 심지 못하기 때문이다.
  await queryClient.prefetchQuery({
    queryKey: userQueryKeys.me.queryKey,
    queryFn: async () => userService.me(await withServerAuth()),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AppShell>{children}</AppShell>
    </HydrationBoundary>
  );
}
