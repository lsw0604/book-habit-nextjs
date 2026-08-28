"use client";

import type { ReactNode } from "react";

import { useAuthProvider } from "./use-auth-provider";

/** 인증 전환 이벤트를 구독한다. `QueryProvider` 안쪽에 있어야 한다. */
export function AuthProvider({ children }: { children: ReactNode }) {
  useAuthProvider();

  return <>{children}</>;
}
