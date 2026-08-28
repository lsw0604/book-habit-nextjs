"use client";

import { useState, type FormEvent } from "react";

import { useLogin } from "../hooks/useLogin";

/**
 * 스타일은 최소한으로만 두었다. DESIGN.md의 시맨틱 토큰이 아직 `globals.css`에
 * 구현되지 않아, 지금 브랜드 색을 쓰면 base HEX를 하드코딩하게 된다.
 * 토큰이 들어오면 그때 입힌다.
 */
export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate, isPending, error } = useLogin();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <h1 className="text-2xl font-bold">로그인</h1>

      <label className="flex flex-col gap-1">
        <span className="text-sm">이메일</span>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          className="rounded-lg border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm">비밀번호</span>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          className="rounded-lg border px-3 py-2"
        />
      </label>

      {/* 검증 실패(400)는 여러 메시지가 ", "로 이어져 오므로 줄바꿈해 보여준다. */}
      {error && (
        <p role="alert" className="text-sm whitespace-pre-line">
          {error.message.split(", ").join("\n")}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "로그인 중…" : "로그인"}
      </button>
    </form>
  );
}
