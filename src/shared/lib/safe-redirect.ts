/**
 * 외부에서 들어온 리다이렉트 경로를 안전한 값으로 좁힌다.
 *
 * `?redirectTo=`는 URL에 노출되므로 공격자가 값을 정할 수 있다. 그대로 믿고
 * 이동하면 오픈 리다이렉트가 된다 — 우리 도메인 링크를 클릭했는데 피싱
 * 사이트로 넘어가는 식이다.
 *
 * 그래서 **같은 출처의 절대 경로만** 통과시킨다.
 * - `//evil.com`은 프로토콜 상대 URL이라 외부로 나간다
 * - `/\evil.com`은 일부 브라우저가 `//`처럼 해석한다
 * - `https://evil.com`처럼 스킴이 붙은 값도 막힌다
 *
 * @param value - 신뢰할 수 없는 입력. 보통 `redirectTo` 쿼리 값
 * @param fallback - 값이 안전하지 않을 때 대신 쓸 경로
 */
export const toSafeRedirectPath = (
  value: string | null | undefined,
  fallback = "/",
): string => {
  if (!value) return fallback;

  // 반드시 "/"로 시작하는 상대 경로여야 한다.
  if (!value.startsWith("/")) return fallback;

  // "//" 와 "/\" 는 외부 출처로 나갈 수 있다.
  if (value.startsWith("//") || value.startsWith("/\\")) return fallback;

  return value;
};
