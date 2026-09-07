/**
 * 인증 전환 알림.
 *
 * 로그인·회원가입은 `features`가, 세션 만료는 `app`의 인터셉터 설정이 알린다.
 * 알리는 쪽은 "무슨 일이 일어났다"만 말하고, 무엇을 할지(캐시 비우기·화면 이동)는
 * `app`의 `auth-provider`가 정한다. `features`는 상위 레이어를 import할 수 없으니
 * 그 제어 역전이 필요하다.
 *
 * 예전에는 범용 EventEmitter를 썼는데 과했다. 실제로 레이어를 거스르는 알림은
 * `authenticated` 하나뿐이고(만료는 발행·구독이 둘 다 `app`이다), 구독자도
 * `auth-provider` 하나다. 무엇보다 `emit`에서 핸들러로 코드를 따라갈 수 없어
 * "로그인하면 무슨 일이 일어나는가"를 읽어서 알 수 없었다 — 리다이렉트 버그를
 * 진단할 때 실제로 이게 발목을 잡았다. `shared/api`가 인터셉터에 `refreshFn`을
 * 주입받는 것과 같은 방식으로 줄였다.
 *
 * 핸들러는 **한 벌만** 등록된다. 인증 전환을 여러 곳에서 처리하기 시작하면
 * 어디서 무엇이 일어나는지가 다시 흐려진다. 등록은 브라우저에서만 일어난다
 * (`auth-provider`의 effect).
 */
export interface AuthTransitionHandlers {
  /** 로그인·회원가입 성공. 세션이 새로 생겼다. */
  onAuthenticated: () => void;
  /** 사용자가 스스로 로그아웃했다. */
  onLoggedOut: () => void;
  /** 토큰 갱신까지 실패해 세션이 끝났다. */
  onSessionExpired: (reason: string) => void;
}

let handlers: AuthTransitionHandlers | null = null;

/**
 * 인증 전환을 처리할 핸들러를 등록한다.
 *
 * @returns 등록 해제 함수. `useEffect`의 cleanup으로 그대로 쓴다.
 */
export const setAuthTransitionHandlers = (
  next: AuthTransitionHandlers,
): (() => void) => {
  handlers = next;

  return () => {
    // 이미 다른 등록이 덮어썼다면 그쪽이 최신이다. 남의 등록을 지우지 않는다.
    if (handlers === next) handlers = null;
  };
};

/**
 * 등록 전에 알림이 오면 처리가 조용히 사라진다. 그건 곧 로그인 후 이동 같은 게
 * 통째로 유실됐다는 뜻이라 삼키지 않고 알린다 — 예전 EventEmitter는 구독자가
 * 없으면 아무 말 없이 무시했고, 그런 실패는 증상만 보고는 원인을 못 찾는다.
 *
 * 개발 중에는 HMR로도 걸린다(실측). 이 파일이 갱신되면 모듈이 재평가되어
 * `handlers`가 초기화되는데, `auth-provider`의 파일은 그대로라 effect가 다시
 * 돌지 않아 재등록되지 않는다. 새로고침하면 복구된다. 모듈 스코프 상태를 두는
 * 한 따라오는 제약이라(예전 EventEmitter의 구독 Map도 같았다), 개발 편의를 위해
 * 프로덕션 코드에 HMR 대응을 넣지는 않는다. 프로덕션에서 이 로그가 보인다면
 * 그때는 정말로 `AuthProvider`가 트리에 없는 것이다.
 */
const resolve = (transition: string): AuthTransitionHandlers | null => {
  if (!handlers) {
    console.error(
      `[auth] "${transition}" 처리가 유실됐다. 개발 중이라면 HMR로 등록이 풀린 것이니 ` +
        `새로고침하면 된다. 아니라면 AuthProvider가 트리에 없다.`,
    );
    return null;
  }

  return handlers;
};

export const notifyAuthenticated = () =>
  resolve("authenticated")?.onAuthenticated();

export const notifyLoggedOut = () => resolve("logged-out")?.onLoggedOut();

export const notifySessionExpired = (reason: string) =>
  resolve("session-expired")?.onSessionExpired(reason);
