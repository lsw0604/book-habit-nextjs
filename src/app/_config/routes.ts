/**
 * 인증 전환 시 이동할 경로. app 레이어의 정책이라 여기에 둔다.
 *
 * `features`가 이 값을 알 필요는 없다. 로그인 성공을 알리기만 하고
 * 어디로 보낼지는 `auth-provider`가 정한다.
 */
export const LOGIN_ROUTE = "/login";

/** 로그인 후 갈 기본 경로. `redirectTo`가 없거나 안전하지 않을 때 쓴다. */
export const DEFAULT_AUTHENTICATED_ROUTE = "/";

/** 로그아웃·세션 만료 후 갈 경로. */
export const DEFAULT_UNAUTHENTICATED_ROUTE = LOGIN_ROUTE;

/**
 * 세션 만료로 로그인 화면에 왔다는 표시.
 *
 * 만료된 access_token 쿠키는 HttpOnly라 클라이언트가 지우지 못하고, `proxy`는
 * 쿠키의 **존재만** 보므로 그대로 두면 "로그인된 사용자"로 읽힌다. 그러면
 * 만료 처리가 보낸 로그인 화면을 `proxy`가 다시 `redirectTo`로 되돌리고,
 * 그 화면이 또 401을 받아 만료 처리를 부르는 무한 루프가 된다(실측 확인).
 *
 * 이 표시가 붙은 요청에서는 `proxy`가 되돌리지 않고 죽은 쿠키를 지운다.
 */
export const SESSION_EXPIRED_PARAM = "expired";

/**
 * 비로그인 상태로 머무는 화면들. `(auth)` 그룹과 일치시킨다.
 *
 * 이미 이 경로에 있으면 로그인 화면으로 다시 보내지 않는다(리다이렉트 루프 방지).
 * 로그인에 성공했을 때 여기서 벗어나야 하는지 판단하는 데도 쓴다.
 */
export const AUTH_ROUTES = [LOGIN_ROUTE, "/register"] as const;

/**
 * 로그인이 필요한 화면. 하위 경로까지 포함한다.
 *
 * `(main)` 전체를 막지 않는 이유는 홈·검색이 비로그인에게도 보여줄 게 있기
 * 때문이다. 개인 데이터만 다루는 화면을 여기에 하나씩 등록한다.
 */
export const PROTECTED_ROUTES = ["/library"] as const;

/** `/login`과 `/loginfoo`를 구분하려면 경계(`/`)까지 확인해야 한다. */
const matchesRoute = (pathname: string, route: string): boolean =>
  pathname === route || pathname.startsWith(`${route}/`);

export const isAuthRoute = (pathname: string): boolean =>
  AUTH_ROUTES.some((route) => matchesRoute(pathname, route));

export const isProtectedRoute = (pathname: string): boolean =>
  PROTECTED_ROUTES.some((route) => matchesRoute(pathname, route));
