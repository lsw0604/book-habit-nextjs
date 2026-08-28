import type { ReactNode } from "react";

/**
 * 로그인·회원가입처럼 세션이 아직 없는 화면들의 그룹.
 *
 * `(main)`과 달리 `cookies()`를 호출하지 않는다. 그래서 이 그룹은 정적으로
 * 프리렌더되고, 로그아웃 상태 방문자가 가장 먼저 보는 화면이 빠르게 뜬다.
 * 세션 프리페치를 여기 넣으면 그 이점이 사라지므로 넣지 않는다.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-full flex-1 items-center justify-center p-6">
      <div className="w-full max-w-sm">{children}</div>
    </main>
  );
}
