import { NextResponse, type NextRequest } from "next/server";

import {
  ACCESS_TOKEN_COOKIE,
  DEFAULT_AUTHENTICATED_ROUTE,
  isAuthRoute,
  isProtectedRoute,
  LOGIN_ROUTE,
  REFRESH_TOKEN_COOKIE,
  SESSION_EXPIRED_PARAM,
} from "@/app/_config";
import { toSafeRedirectPath } from "@/shared/lib";

/**
 * 인증 가드. HTML을 내려보내기 **전에** 판단하므로 보호 화면이 잠깐 보였다
 * 사라지는 깜빡임이 없다 — 클라이언트에서 `useSession`을 기다려 리다이렉트하면
 * 그 사이 화면이 한 번 그려진다(`docs/portability.md` 4장).
 *
 * 어떤 쿠키를 보는지와 그 이유는 `_config/auth.ts`에 적어 뒀다. 존재만 확인하고
 * 유효성은 API에 맡긴다 — 만료된 채 통과해도 화면의 첫 조회가 401을 받아
 * 인터셉터가 갱신하거나 세션을 끝낸다.
 *
 * Next 16에서 `middleware.ts`가 이 이름으로 바뀌었다. export 이름도 `proxy`다.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  // 어느 쪽이든 있으면 세션으로 본다. 이유는 `_config/auth.ts` 참고.
  const hasSession =
    request.cookies.has(ACCESS_TOKEN_COOKIE) ||
    request.cookies.has(REFRESH_TOKEN_COOKIE);

  // 로그인이 필요한 화면인데 세션이 없다. 원래 가려던 곳을 남겨 로그인 후 되돌린다.
  if (!hasSession && isProtectedRoute(pathname)) {
    const loginUrl = new URL(LOGIN_ROUTE, request.url);
    loginUrl.searchParams.set("redirectTo", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  // 이미 세션이 있는데 로그인·회원가입 화면에 왔다. 뒤로가기로 흘러든 경우가 많다.
  //
  // 위 분기가 붙여 준 `redirectTo`가 남아 있으면 버리지 않고 그곳으로 돌려보낸다.
  // 카카오 콜백처럼 document 네비게이션으로 돌아오는 경로는 클라이언트의
  // `auth-provider`를 거치지 않아서, 여기서 버리면 원래 가려던 화면을 되찾을
  // 방법이 아예 없다.
  if (hasSession && isAuthRoute(pathname)) {
    // 세션 만료로 떠밀려 온 요청이다. 쿠키는 남아 있지만 서버가 이미 거절한
    // 값이라 되돌리면 그대로 루프가 된다. 되돌리지 않고, 여기서 죽은 쿠키를
    // 지워 다음 요청부터는 정상적으로 "세션 없음"으로 읽히게 한다.
    if (request.nextUrl.searchParams.has(SESSION_EXPIRED_PARAM)) {
      const response = NextResponse.next();
      // 심을 때와 같은 path로 지워야 한다. 다른 path로 보내면 지워지지 않는다.
      response.cookies.delete({ name: ACCESS_TOKEN_COOKIE, path: "/" });
      response.cookies.delete({
        name: REFRESH_TOKEN_COOKIE,
        path: "/api/auth",
      });
      return response;
    }

    const target = new URL(
      toSafeRedirectPath(
        request.nextUrl.searchParams.get("redirectTo"),
        DEFAULT_AUTHENTICATED_ROUTE,
      ),
      request.url,
    );

    // `redirectTo`가 다시 인증 화면을 가리키면 같은 분기로 돌아와 루프가 된다.
    // 값이 안전하더라도(같은 출처의 절대 경로여도) 여기서 한 번 더 걸러야 한다.
    if (isAuthRoute(target.pathname)) {
      return NextResponse.redirect(
        new URL(DEFAULT_AUTHENTICATED_ROUTE, request.url),
      );
    }

    return NextResponse.redirect(target);
  }

  return NextResponse.next();
}

export const config = {
  /**
   * 정적 자산과 이미지 최적화 요청은 검사할 이유가 없다. 매 요청마다 도는
   * 코드라 대상을 좁힐수록 좋다.
   */
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
