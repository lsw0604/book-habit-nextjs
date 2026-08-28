"use client";

import { useMutation } from "@tanstack/react-query";

import type { APIError } from "@/shared/api";
import { authEvents } from "@/entities/user";

import { loginService } from "../api";
import type { LoginRequestDTO } from "../api";

type LoginResponse = Awaited<ReturnType<typeof loginService.login>>;

export const useLogin = () =>
  useMutation<LoginResponse, APIError, LoginRequestDTO>({
    mutationFn: (body) => loginService.login(body),
    onSuccess: () => authEvents.emit("auth:authenticated"),
  });
