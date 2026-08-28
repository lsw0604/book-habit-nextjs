import type { Metadata } from "next";

import { LoginForm } from "@/features/login";

export const metadata: Metadata = {
  title: "로그인 · book-habit",
};

/**
 * `redirectTo` 쿼리는 여기서 읽지 않는다. `searchParams`를 받으면 이 페이지가
 * 동적 렌더링으로 바뀌는데, 이 값은 폼 제출 시점에만 필요하다.
 * `LoginForm`이 그때 `window.location`에서 읽고 안전한 경로로 좁힌다.
 */
export default function LoginPage() {
  return <LoginForm />;
}
