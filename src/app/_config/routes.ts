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
 * 비로그인 상태로 머무는 화면들. `(auth)` 그룹과 일치시킨다.
 *
 * 이미 이 경로에 있으면 로그인 화면으로 다시 보내지 않는다(리다이렉트 루프 방지).
 * 로그인에 성공했을 때 여기서 벗어나야 하는지 판단하는 데도 쓴다.
 */
export const AUTH_ROUTES = [LOGIN_ROUTE, "/signup"] as const;

export const isAuthRoute = (pathname: string): boolean =>
  AUTH_ROUTES.some((route) => pathname.startsWith(route));
