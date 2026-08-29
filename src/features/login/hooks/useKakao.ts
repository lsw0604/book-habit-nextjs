"use client";

import { useMutation } from "@tanstack/react-query";

import type { APIError } from "@/shared/api";
import { authEvents } from "@/entities/user";

import { loginService } from "../api";
import type { KakaoLoginRequestDTO } from "../api";

type KakaoLoginResponse = Awaited<ReturnType<typeof loginService.kakaoLogin>>;

export const useKakao = () =>
  useMutation<KakaoLoginResponse, APIError, KakaoLoginRequestDTO>({
    mutationFn: ({ code }) => loginService.kakaoLogin({ code }),
    onSuccess: () => authEvents.emit("auth:authenticated"),
  });
